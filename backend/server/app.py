#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify, g
from flask_restful import Resource
from service import (
    AuthService,
    UserService, DriverService, OwnerService,
    BookingService, 
    BusService,
    RouteService, LocationService, 
    token_required_socketio # Custom websocket auth 'middleware'
)

from controllers.drivers import Drivers, DriverById, DriverTrips, DriverTripById
from controllers.auth import Auth
# Local imports
from config import app, db, api

# Websockets
from middleware.auth import token_required
from flask_socketio import SocketIO, join_room, emit, leave_room
from geopy.distance import geodesic  # For calculating distance
from config import socketio # Import socketio
from datetime import datetime
from models import UserRole, TripStatus

# Connection handler
@socketio.on('connect')
def handle_connect():
    # Call the token validation middleware
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

# # Use the `token_required_socketio` middleware for all incoming WebSocket connections
# socketio.use(token_required_socketio)  # Runs the authentication 'middleware' before any event

@socketio.on('location_update')
def handle_location_update(data):
    print('Location update from driver:', data)
    emit('location_broadcast', data, broadcast=True)

## Emitting location update for a particular bus through bus id

# WebSocket handlers that powers admin
@socketio.on('admin_request_trips')
def handle_admin_trip_request():
    print('admin requeted trips...')
    """Send list of active trips to admin"""
    if not token_required_socketio():
        return False
    
    user = token_required_socketio()
    if user.role != UserRole.admin:
        emit('error', {'message': 'Unauthorized'})
        return

    active_trips = BusService.findAll(status=TripStatus.started) # whose status is started
    # json_response = make_response(jsonify(active_trips),200)
    emit('admin_active_trips', active_trips)

@socketio.on('admin_track_trip')
def handle_admin_track_trip(data):
    """Admin subscribes to specific trip updates"""
    if not token_required_socketio():
        return False
    
    user = token_required_socketio()
    if user.role != UserRole.admin:
        emit('error', {'message': 'Unauthorized'})
        return

    bus_id = data.get('bus_id')
    if not bus_id:
        emit('error', {'message': 'Missing bus_id'})
        return

    # Join admin to bus-specific room
    join_room(f'admin_bus_{bus_id}')
    emit('message', {'data': f'Now tracking bus {bus_id}'})

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

## Emitting location update of the bus, wherever it may be

# ## if parent.email == user.email:  # Check if the parent is the current authenticated user (right before emit)
# @socketio.on('bus_location_update')
# def handle_bus_location(data):
#     print('LISTENING FOR BUS... ', data)
#     user = token_required_socketio()  # Driver's identity is validated here
#     print(f"CURRENT USER: {user.email} ROLE: {user.role}")  # Can access email after the middleware has set `socket.user`
    
#     bus_id = data.get("trip_id")  # Extract bus trip ID
#     lat = data.get("latitude")    # Extract latitude
#     lng = data.get("longitude")   # Extract longitude

#     # Get bookings for this bus
#     bus = BusService.findOne(id=bus_id)
#     if not bus:
#         print(f"Bus not found with ID: {bus_id}")
#         emit('error', {'message': 'Bus not found'})
#         return
#     # # For admin
#     # route = RouteService.findById(bus.route_id)
#     # if not route:
#     #     print(f"Route not found for bus with ID: {bus_id}, Route ID: {bus.route_id}")
#     #     emit('error', {'message': 'Route not found'})
#     #     return

#     # print(f"Found Bus: {bus}, Route: {route}")
#     bookings = bus.bookings  # All bookings for this bus
#     if not bookings:
#         print(f"No bookings found for bus with ID: {bus_id}")
#         return

#     # For each booking, emit updates to the parent rooms
#     for booking in bookings:
#         if booking.parent_id: # Check if this booking belongs to a parent (relevant for parent tracking)
#             parent = UserService.findById(id=booking.parent_id)
#             room_name = f"parent_{parent.id}_booking_{booking.id}"
#             emit('bus_location_update_to_parent', {
#                 'bus_id': bus_id,
#                 'latitude': lat,
#                 'longitude': lng,
#                 'child_name': booking.child_name,
#                 'dropoff_location': booking.dropoff
#             }, room=room_name)  # Send to the parent's specific room

#     # Emit to the admin room
#     if user.role == 'admin':
#         emit('bus_location_update_to_admin', {
#             'bus_id': bus_id,
#             'latitude': lat,
#             'longitude': lng,
#             'route': RouteService.findById(bus.route_id).locations, # 'route': route.locations,  # Provide full route for admin
#             'bookings': bookings
#         }, room='admin')  # Send to the admin's room

# Add your model imports

class Users(Resource):
    method_decorators = [token_required]
    def get(self):
        users = UserService.findAll()
        return make_response(
            jsonify(users),
            200        
        )
class UserById(Resource):
    # method_decorators = [token_required]
    def get(self,id):
        print('I got hit')
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        user=UserService.findById(id)
        if user:
            response=make_response(
                jsonify(user.to_dict(rules=('-password_hash',))),
                200
            )
  
            return response
        return make_response(jsonify({'message':'user not found'}),404)

    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        user=UserService.findById(id)
        if user:
            for attr in data:
                print(data[attr])
                setattr(user,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(user.to_dict(rules=('-password_hash',))),
                200
            )
            return response
        return make_response(jsonify({'message':'user not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        user=UserService.findById(id)
        if user:
            db.session.delete(user)
            db.session.commit()
            response_body=jsonify({'Message':f'user : *{user.username}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'user not found'}),404)

# Get current user after log in
class CurrentUser(Resource):
    method_decorators = [token_required]

    def get(self):
        user = UserService.findById(g.user_id)
        if user:
            return make_response(jsonify(user.to_dict(rules=('-password_hash',))), 200)
        return make_response(jsonify({'message': 'User not found'}), 404)
    

class Owners(Resource):
    method_decorators = [token_required]
    def get(self):
        owners = OwnerService.findAll()
        return make_response(
            jsonify(owners),
            200        
        )
    
    def post(self):
        data=request.get_json()
        owner_name = data['owner_name']
        if owner_name == None:
            return make_response("Required Inputs are required", 400)
        
        new_owner = OwnerService.createOwner(owner_name)
        db.session.add(new_owner)
        db.session.commit()
        response=make_response(
            {"owner":new_owner.to_dict(),"message":"owner created successfully"},
            201
        )
        return response
    
class OwnerById(Resource):
    method_decorators = [token_required]
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        owner=OwnerService.findById(id)
        if owner:
            response=make_response(
                jsonify(owner.to_dict()),
                200
            )
  
            return response
        return make_response(jsonify({'message':'owner not found'}),404)

    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        owner=OwnerService.findById(id)
        if owner:
            for attr in data:
                setattr(owner,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(owner.to_dict()),
                200
            )
            return response
        return make_response(jsonify({'message':'Owner not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        owner=OwnerService.findById(id)
        if owner:
            db.session.delete(owner)
            db.session.commit()
            response_body=jsonify({'Message':f'owner : *{owner.owner_name}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'owner not found'}),404)

class Bookings(Resource):
    method_decorators = [token_required]
    def get(self):
        bookings = BookingService.findAll()
        return make_response(
            jsonify(bookings),
            200        
        )
    
    def post(self):
        data = request.get_json()
        # validate parent_id, bus_id, pick_up, drop_off
        new_booking = BookingService.createBooking(
            parent_id=data["parent_id"],
            bus_id=data["bus_id"],
            title=data["title"],
            child_name=data["child_name"],
            pickup=data["pickup"],
            dropoff=data["dropoff"],
            price=float(data["price"])
        )
        db.session.add(new_booking)
        db.session.commit()
        response=make_response(
            {"driver":new_booking.to_dict(),"message":"Booking created successfully"},
            201
        )
        return response

class BookingById(Resource):
    method_decorators = [token_required]
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        booking=BookingService.findOne(id)
        if booking:
            response=make_response(
                jsonify(booking.to_dict()),
                200
            )
  
            return response
        return make_response(jsonify({'message':'booking not found'}),404)
    
    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        booking=BookingService.findOne(id)
        if booking:
            for attr in data:
                setattr(booking,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(booking.to_dict()),
                200
            )
            return response
        return make_response(jsonify({'message':'booking not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        booking=BookingService.findOne(id)
        if booking:
            db.session.delete(booking)
            db.session.commit()
            response_body=jsonify({'Message':f'Booking : *{booking.id}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'booking not found'}),404)  

class Routes(Resource):
    method_decorators = [token_required]
    def get(self):
        routes = RouteService.findAll()
        return make_response(
            jsonify(routes),
            200        
        )

    def post(self):
        data = request.get_json()
        new_route = RouteService.createRoute(
            start=data["start"],
            end=data["end"]
        )
        db.session.add(new_route)
        db.session.commit()

        response=make_response(
            {"route":new_route.to_dict(),"message":"Route created successfully"},
            201
        )
        return response

class RouteById(Resource):
    method_decorators = [token_required]
    def get(self, id):
        route = RouteService.findOne(id=id, increment_search=True)
        return make_response(
            jsonify(route.to_dict()),
            200        
        )

    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        route=RouteService.findById(id)
        if route:
            for attr in data:
                setattr(route,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(route.to_dict()),
                200
            )
            return response
        return make_response(jsonify({'message':'route not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        route=RouteService.findById(id)
        if route:
            db.session.delete(route)
            db.session.commit()
            response_body=jsonify({'Message':f'route : *{route.id}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'route not found'}),404)  

# New route for top searched routes
class TopRoutes(Resource):
    method_decorators = [token_required]

    def get(self):
        try:
            limit = int(request.args.get("limit", 6))
        except ValueError:
            return make_response({"message": "Invalid limit parameter"}, 400)

        top_routes = RouteService.getTopSearched(limit=limit)
        return make_response(jsonify(top_routes), 200)

class Locations(Resource):
    method_decorators = [token_required]
    def get(self):
        locations = LocationService.findAll()
        return make_response(
            jsonify(locations),
            200        
        )

    def post(self):
        data = request.get_json()
        location_name = data.get("location_name")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        route_id = data.get("route_id")

        new_location = LocationService.createLocation(location_name, latitude, longitude, route_id)
        db.session.add(new_location)
        db.session.commit()

        response=make_response(
            {"location":new_location.to_dict(),"message":"Location created successfully"},
            201
        )
        return response

class LocationById(Resource):
    method_decorators = [token_required]
    def get(self, id):
        location = LocationService.findOne(id)
        return make_response(
            jsonify(location.to_dict()),
            200        
        )

    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        location = LocationService.findOne(id)
        if location:
            for attr in data:
                setattr(location,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(location.to_dict()),
                200
            )
            return response
        return make_response(jsonify({'message':'location not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        location = LocationService.findOne(id)
        if location:
            db.session.delete(location)
            db.session.commit()
            response_body=jsonify({'Message':f'location : *{location.id}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'location not found'}),404)  

class Buses(Resource):
    method_decorators = [token_required]
    def post(self):
        data = request.get_json()

        new_bus = BusService.createBus(
            route_id=data["route_id"],
            driver_id=data["driver_id"],
            owner_id=data["owner_id"],
            plate=data["plate"],
            capacity=data["capacity"]
        )

        db.session.add(new_bus)
        db.session.commit()
        response=make_response(
            {"bus":new_bus.to_dict(),"message":"Bus created successfully"},
            201
        )
        return response

    def get(self):
        buses = BusService.findAll()
        return make_response(
            jsonify(buses),
            200        
        )
    
class BusById(Resource):
    method_decorators = [token_required]
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        bus=BusService.findOne(id=id)
        if bus:
            response=make_response(
                jsonify(bus.to_dict()),
                200
            )
  
            return response
        return make_response(jsonify({'message':'bus not found'}),404)
    
    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        bus=BusService.findOne(id)
        if bus:
            for attr in data:
                setattr(bus,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(bus.to_dict()),
                200
            )
            return response
        return make_response(jsonify({'message':'bus not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        bus=BusService.findOne(id)
        if bus:
            db.session.delete(bus)
            db.session.commit()
            response_body=jsonify({'Message':f'bus : *{bus.id}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'user not found'}),404)  


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Auth, '/api/auth')
api.add_resource(Users, '/api/users')
api.add_resource(UserById, '/api/users/<int:id>')
api.add_resource(CurrentUser, '/api/users/me')
#  Drivers endpoint
api.add_resource(Drivers, '/api/drivers')
api.add_resource(DriverById, '/api/drivers/<int:id>')
api.add_resource(DriverTrips, '/api/drivers/<int:id>/trips')
api.add_resource(DriverTripById, '/api/drivers/<int:id>/trip/<int:trip_id>')

api.add_resource(Owners, '/api/owners')
api.add_resource(OwnerById, '/api/owners/<int:id>')
api.add_resource(Bookings, '/api/bookings')
api.add_resource(BookingById, '/api/bookings/<int:id>')
api.add_resource(Routes, '/api/routes')
api.add_resource(RouteById, '/api/routes/<int:id>')
api.add_resource(TopRoutes, '/api/routes/top')
api.add_resource(Locations, '/api/locations')
api.add_resource(LocationById, '/api/locations/<int:id>')
api.add_resource(Buses, '/api/buses')
api.add_resource(BusById, '/api/buses/<int:id>')

if __name__ == '__main__':
    # app.run(port=5555, debug=True)
    socketio.run(app, port=5555, debug=True)
