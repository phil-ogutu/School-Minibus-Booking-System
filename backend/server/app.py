#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource
from service import (
    AuthService,
    UserService, DriverService, OwnerService,
    BookingService, 
)

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

class Drivers(Resource):
    def get(self):
        drivers = DriverService.findAll()
        return make_response(
            jsonify(drivers),
            200        
        )
    def post(self):
        data=request.get_json()
        driver_name = data['driver_name']
        if driver_name == None:
            return make_response("Required Inputs are required", 400)
        
        new_driver = DriverService.createDriver(driver_name)
        db.session.add(new_driver)
        db.session.commit()
        response=make_response(
            {"driver":new_driver,"message":"Driver created successfully"},
            201
        )
        return response
    
class DriverById(Resource):
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        driver=DriverService.findById(id)
        if driver:
            response=make_response(
                jsonify(driver),
                200
            )
  
            return response
        return make_response(jsonify({'message':'driver not found'}),404)
    
    def post(self):
        data=request.get_json()
        action=data['action']
        owner_id=data['owner_id']
        bus_id=data['bus_id']

        # check if bus exists
        # check if owner exists 
        if action == 'assign':
            # assign to bus by owner
            pass
        elif action == 'release':
            pass
        else:
            pass

    def patch(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        driver=DriverService.findById(id)
        if driver:
            for attr in data:
                setattr(driver,attr,data[attr])
            db.session.commit()
            response=make_response(
                jsonify(driver.to_dict()),
                200
            )
            return response
        return make_response(jsonify({'message':'driver not found'}),404)
    
    def delete(self,id):  
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
              
        driver=DriverService.findById(id)
        if driver:
            db.session.delete(driver)
            db.session.commit()
            response_body=jsonify({'Message':f'driver : *{driver.driver_name}* is deleted successfully'})
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'user not found'}),404)

class Owners(Resource):
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
            {"owner":new_owner,"message":"owner created successfully"},
            201
        )
        return response
    
class OwnerById(Resource):
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        owner=OwnerService.findById(id)
        if owner:
            response=make_response(
                jsonify(owner),
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
            price=data["price"]
        )
        db.session.add(new_booking)
        db.session.commit()
        response=make_response(
            {"driver":new_booking,"message":"Booking created successfully"},
            201
        )
        return response

class BookingById(Resource):
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        booking=BookingService.findOne(id)
        if booking:
            response=make_response(
                jsonify(booking),
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
        return make_response(jsonify({'message':'user not found'}),404)  

class Routes(Resource):
    pass

class Locations(Resource):
    pass

class Buses(Resource):
    pass

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Auth, '/api/auth')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
