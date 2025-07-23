from functools import wraps
from flask import request, g
import jwt

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