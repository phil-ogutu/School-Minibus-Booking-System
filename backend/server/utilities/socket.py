from config import socketio 
from middleware.auth import token_required_socketio
from models import UserRole, TripStatus
from flask_socketio import SocketIO, join_room, emit, leave_room

@socketio.on('connect')
def handle_connect():
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