from config import socketio 
from middleware.auth import token_required_socketio
from models import UserRole, TripStatus
from flask_socketio import SocketIO, join_room, emit, leave_room
from geopy.distance import geodesic
from service import BusService, RouteService, UserService
from datetime import datetime

print("🧠 socket.py loaded")

@socketio.on('connect')
def handle_connect():
    print("[Socket.IO] Connect attempt received")

    print(socketio.async_mode)
    if not token_required_socketio():
        return False  # Reject connection if token validation fails
    
    user = token_required_socketio()  # Get the user after token is validated
    print(f"User connected: {user.email}, Role: {user.role}")

    if user.role == UserRole.parent:  # Compare with enum:  # If the user is a parent, add them to a room based on their booking
        for booking in user.bookings:  # Each parent has bookings
            print(f"Checking BOOKING for parent {user.email}: {booking}") 
            if booking.parent_id == user.id:
                room_name = f"parent_{user.id}_booking_{booking.id}"  # Unique room for the booking
                print(f"Parent {user.email} joining room: {room_name}")
                join_room(room_name) 
                emit('message', {'data': f'Joined room: {room_name}'})
    
    if user.role == UserRole.admin:  # Admin can track all buses
        join_room('admin')  # Admin joins a general admin room
        print(f"Admin {user.email} joined the admin room")
        emit('message', {'data': 'Joined admin room'})

@socketio.on('disconnect')
def handle_disconnect():
    user = token_required_socketio()
    print(f"User {user.email} disconnected") 

    if user.role == 'parent':
        for booking in user.bookings:
            room_name = f"parent_{user.id}_booking_{booking.id}"
            leave_room(room_name)
            print(f"Parent {user.email} left room: {room_name}")

    if user.role == 'admin':
        leave_room('admin')
        print(f"Admin {user.email} left the admin room")

    print('Client disconnected')

@socketio.on('location_update')
def handle_location_update(data):
    print('Location update from driver:', data)
    emit('location_broadcast', data, broadcast=True)


@socketio.on('bus_location_update')
def handle_bus_location(data):
    print('LISTENING FOR BUS... ', data)
    
    # Token required for user authentication
    user = token_required_socketio() 
    
    # Get bus ID and location data from the incoming message
    bus_id = int(data.get("trip_id"))  # Ensure it's an integer
    lat = float(data.get("latitude"))  # Latitude
    lng = float(data.get("longitude"))  # Longitude

    print(f"Received bus location update: Bus ID: {bus_id}, Latitude: {lat}, Longitude: {lng}")
    
    if not bus_id or not lat or not lng:
        emit('error', {'message': 'Missing data in location update'})
        return

    bus = BusService.findOne(id=bus_id)
    if not bus:
        print(f"Bus not found with ID: {bus_id}")
        emit('error', {'message': 'Bus not found'})
        return

    route = RouteService.findById(bus.route_id)
    if not route:
        print(f"Route not found for bus with ID: {bus_id}, Route ID: {bus.route_id}")
        emit('error', {'message': 'Route not found'})
        return
    
    print(f"Found Bus: {bus}, Route: {route}")

    # Get the checkpoints from the route (General notification)
    checkpoints = route.locations
    if not checkpoints:
        print(f"No locations found for route {route.id}")
    
    # Sort checkpoints by distance to the bus's current location
    sorted_checkpoints = sorted(checkpoints, key=lambda loc: geodesic((lat, lng), (loc.latitude, loc.longitude)).meters)

    # Personalized notification (Notification to room)
    bookings = bus.bookings  # All bookings for this bus
    if not bookings:
        print(f"No bookings found for bus with ID: {bus_id}")
        return

    # For each booking, emit updates to the parent rooms (frequent, No notifications)
    for booking in bookings:
        if booking.parent_id: # Check if this booking belongs to a parent (relevant for parent tracking)
            parent = UserService.findById(id=booking.parent_id)
            room_name = f"parent_{parent.id}_booking_{booking.id}"
            print(f"EMITTING BUS LOCATION UPDATE TO PARENT: ==== {room_name}")
            emit('bus_location_update_to_parent', {
                "driver_id": user.id,
                "driver_phone": user.mobile,
                'bus_id': bus_id,
                'latitude': lat,
                'longitude': lng,
                'booking_parent_id': booking.parent_id,
                'booking_id': booking.id,
                'child_name': booking.child_name,
                'dropoff_location': booking.dropoff, # If we had lat and long, we would calculate distance and time left (do this from frontend)
                'route_start': route.start,
                'route_end': route.end,
                'trip_stops': [loc.to_dict(rules=('-routes',)) for loc in route.locations]
            }, room=room_name)  # Send to the parent's specific room

    # For each checkpoint, calculate the distance and possibly emit data
    for checkpoint in sorted_checkpoints:
        distance = geodesic((lat, lng), (checkpoint.latitude, checkpoint.longitude)).meters
        print(f"Distance to checkpoint {checkpoint.location_name}: {distance} meters")

        # If the bus is within 50 meters of the checkpoint
        if distance < 50:
            print(f"Bus has reached checkpoint: {checkpoint.location_name}")  # Logging checkpoint near 50 meters

            # Estimate the time to next checkpoint (if any) based on bus speed
            time_to_next_checkpoint = None
            if len(sorted_checkpoints) > 1:
                next_checkpoint = sorted_checkpoints[1]  # The next checkpoint after the current one
                distance_to_next = geodesic((checkpoint.latitude, checkpoint.longitude), (next_checkpoint.latitude, next_checkpoint.longitude)).meters
                bus_speed = 15  # Example bus speed in m/s (adjust based on your data)
                time_to_next_checkpoint = distance_to_next / bus_speed  # Time to next checkpoint in seconds

            # Emitting the event with necessary data
            emit("bus_checkpoint_reached", {
                "driver_id": user.id,
                "driver_phone": user.mobile,
                "bus_id": bus_id,
                "checkpoint": checkpoint.location_name, # If checkpoint matches booking.dropoff in frontend, final destination reached. Else, get distance time to dropoff (frontend)
                "latitude": checkpoint.latitude,
                "longitude": checkpoint.longitude,
                "estimated_time_to_next_checkpoint": time_to_next_checkpoint,  # Estimated time in seconds
                "checkpoints": [loc.to_dict(rules=('-routes',)) for loc in route.locations]  # Convert Location instances to dicts. If any checkpoint matches booking.dropoff in frontend, get dis. time.
            }, broadcast=True)

            break  # Exit after reaching the first checkpoint (remove if you want to process multiple checkpoints)

# Enhanced location update handler (driver location for search by bus id)
@socketio.on('driver_location_update')
def handle_driver_location(data):
    """Process location update from driver"""
    print(f'DRIVER location updata: {data}')
    driver = token_required_socketio()
    if not driver or driver.role != UserRole.driver:
        return False

    # Validate and process data
    bus_id = int(data.get("trip_id")) # Ensure it's integer (get from trip id)
    lat = data.get('latitude')
    lng = data.get('longitude')
    speed = data.get('speed')
    timestamp = datetime.utcnow()

    if not all([bus_id, lat, lng]):
        emit('error', {'message': 'Missing required data'})
        return

    # Broadcast to admin tracking this bus
    admin_data = {
        'bus_id': bus_id,
        'latitude': lat,
        'longitude': lng,
        'speed': speed,
        'timestamp': timestamp.isoformat(),
        'driver_id': driver.id,
        'driver_name': f"{driver.username}"
    }
    emit('bus_location_update_to_admin', admin_data, room=f'admin_bus_{bus_id}')

    # Send to parents with bookings on this bus
    bus = BusService.findOne(id=bus_id)
    if not bus:
        return
    
    route = RouteService.findById(bus.route_id)
    if not route:
        print(f"Route not found for bus with ID: {bus_id}, Route ID: {bus.route_id}")
        emit('error', {'message': 'Route not found'})
        return
    
    checkpoints = route.locations
    if not checkpoints:
        print(f"No locations found for route {route.id}")
    
    # Sort checkpoints by distance to the bus's current location
    sorted_checkpoints = sorted(checkpoints, key=lambda loc: geodesic((lat, lng), (loc.latitude, loc.longitude)).meters)

    nearest_checkpoint = None
    nearest_distance = float('inf')
    for checkpoint in sorted_checkpoints:
        distance = geodesic((lat, lng), (checkpoint.latitude, checkpoint.longitude)).meters
        if distance < nearest_distance:
            nearest_distance = distance
            nearest_checkpoint = checkpoint
        print(f"Distance to checkpoint {checkpoint.location_name}: {distance} meters")
        # If the bus is within 50 meters of the checkpoint
        if distance < 50:
            print(f"Bus has reached checkpoint: {checkpoint.location_name}")  # Logging checkpoint near 50 meters

            # Estimate the time to next checkpoint (if any) based on bus speed
            time_to_next_checkpoint = None
            if len(sorted_checkpoints) > 1:
                next_checkpoint = sorted_checkpoints[1]  # The next checkpoint after the current one
                distance_to_next = geodesic((checkpoint.latitude, checkpoint.longitude), (next_checkpoint.latitude, next_checkpoint.longitude)).meters
                bus_speed = 15  # Example bus speed in m/s (adjust based on actual data)
                time_to_next_checkpoint = distance_to_next / bus_speed  # Time to next checkpoint in seconds

            # Emitting the event with necessary data
            emit("bus_checkpoint_reached", {
                "driver_id": driver.id,
                "driver_phone": driver.mobile,
                "bus_id": bus_id,
                "checkpoint": checkpoint.location_name, # If checkpoint matches booking.dropoff in frontend, final destination reached. Else, get distance time to dropoff (frontend)
                "latitude": checkpoint.latitude,
                "longitude": checkpoint.longitude,
                'speed': speed or 15,
                "next_checkpoint": next_checkpoint.location_name,
                "estimated_time_to_next_checkpoint": time_to_next_checkpoint,  # Estimated time in seconds
                "checkpoints": [loc.to_dict(rules=('-routes',)) for loc in route.locations]  # Convert Location instances to dicts. If any checkpoint matches booking.dropoff in frontend, get dis. time.
            }, broadcast=True)

    for booking in bus.bookings:
        if booking.parent_id:
            parent_data = {
                'bus_id': bus_id,
                'latitude': lat,
                'longitude': lng,
                'booking_id': booking.id,
                'child_name': booking.child_name,
                'current_stop': nearest_checkpoint.location_name if nearest_checkpoint else 'Unknown',
                'timestamp': timestamp.isoformat(),
            }
            emit('bus_location_update_to_parent', parent_data, # """bus location to parent through trip or bus id"""
                 room=f'parent_{booking.parent_id}_booking_{booking.id}') # Parent room (search by route id)

## Emitting location update in general (No bus id)