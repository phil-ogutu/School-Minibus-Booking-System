from functools import wraps
from flask import request, g
import jwt
from config import socketio
from service import UserService

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')

        if not token:
            return {"message": "Token is missing!"}, 401

        try:
            data = jwt.decode(token, 'secret', algorithms=["HS256"])
            g.user_id = data['id']
            g.username = data['name']
        except jwt.ExpiredSignatureError:
            return {"message": "Token expired!"}, 401
        except jwt.InvalidTokenError:
            return {"message": "Invalid token!"}, 401

        return f(*args, **kwargs)
    return decorated


def token_required_socketio():
    # Get the token from the cookies (sent by the frontend)
    token = request.cookies.get('token')
    
    if not token:
        socketio.emit('error', {'message': 'Token is missing!'})
        return None

    try:
        # Decode the JWT token
        decoded_token = jwt.decode(token, 'secret', algorithms=["HS256"])
        user_id = decoded_token['id']
        
        # You can now use `user_id` and `role` to find the user in the database
        user = UserService.findById(id=user_id)
        if not user:
            socketio.emit('error', {'message': 'User not found'})
            return None
        
        return user  # Return user object for further use in emitting events
        
    except jwt.ExpiredSignatureError:
        socketio.emit('error', {'message': 'Token has expired'})
        return None
    except jwt.InvalidTokenError:
        socketio.emit('error', {'message': 'Invalid token'})
        return None