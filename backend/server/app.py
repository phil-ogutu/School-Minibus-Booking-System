#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource
from service import UserService, AuthService

# Local imports
from config import app, db, api

# Add your model imports
class Auth(Resource):
    def post(self):
        data=request.get_json()
        action = data['action']

        username=data['username']
        email=data['email']
        mobile=data['mobile']
        role=data['role']
        password=data['password']

        if action == "register":
            if username == None and email == None and role == None and password == None:
                return make_response("Required Inputs are required", 400)
            
            if UserService.findByEmail(email):
                return make_response("This User already Exists", 400)
            
            password_hash = AuthService.hashPassword(password)
            new_user = UserService.createUser(username, mobile, email, password_hash, role)
            db.session.add(new_user)
            db.session.commit()

            encoded_jwt = AuthService.jwtTokenEncoder({"name": new_user.username,"id":new_user.id,"role":new_user.role})
            response=make_response(
                {"token":encoded_jwt,"message":"User created successfully"},
                201
            )
            response.set_cookie(
                'token',  # cookie name
                encoded_jwt,  # cookie value
                httponly=True,  # prevent JS access
                samesite='Lax',  # adjust depending on cross-site needs
                secure=False  # set to True if using HTTPS in production
            )
            return response
        elif action == "login":
            if email == None and password == None:
                return make_response("Required Inputs are required", 400)
            
            user = UserService.findByEmail(email)
            if not user:
                return make_response("This User does not exist", 400)
            
            if not AuthService.checkPassword(password, user.password_hash):
                return make_response("Wrong Credentials", 400)
            
            encoded_jwt = AuthService.jwtTokenEncoder({"name": user.username,"id":user.id,"role":user.role})
            response=make_response(
                {"token":encoded_jwt,"message":"User Logged in successfully"},
                201
            )
            response.set_cookie(
                'token',
                encoded_jwt,
                httponly=True,
                samesite='Lax',
                secure=False
            )
            return response
        else:
            response=make_response(
                {"message":"unknown auth action"},
                400
            )

class Users(Resource):
    def get(self):
        users = UserService.findAll()
        return make_response(
            jsonify(users),
            200        
        )

class Bookings(Resource):
    def get(self):
        users = UserService.findAll()
        return make_response(
            jsonify(users),
            200        
        )
    
    def post(self):



class Routes(Resource):
    pass

class Locations(Resource):
    pass

class BookingById(Resource):
    pass

class Buses(Resource):
    pass

class Drivers(Resource):
    pass

class Owners(Resource):
    pass

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Auth, '/api/auth')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
