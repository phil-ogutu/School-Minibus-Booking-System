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
    RouteService, LocationService
)
import jwt
from functools import wraps

# Local imports
from config import app, db, api

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
# Add your model imports
class Auth(Resource):
    def post(self):
        data=request.get_json()
        action = data.get('action')


        username = data.get('username')
        email = data.get('email')
        mobile = data.get('mobile')
        role = data.get('role')
        password = data.get('password')

        if action == "register":
            if username == None and email == None and role == None and password == None:
                return make_response("Required Inputs are required", 400)
            
            if UserService.findByEmail(email):
                return make_response("This User already Exists", 400)
            
            password_hash = AuthService.hashPassword(password)
            new_user = UserService.createUser(username, mobile, email, password_hash, role)
            db.session.add(new_user)
            db.session.commit()

            encoded_jwt = AuthService.jwtTokenEncoder({"name": new_user.username,"id":new_user.id,"role":new_user.role.value})
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
            
            encoded_jwt = AuthService.jwtTokenEncoder({"name": user.username,"id":user.id,"role":user.role.value})
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
    method_decorators = [token_required]
    def get(self):
        users = UserService.findAll()
        return make_response(
            jsonify(users),
            200        
        )
class UserById(Resource):
    method_decorators = [token_required]
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
    
class Drivers(Resource):
    method_decorators = [token_required]
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
            {"driver":new_driver.to_dict(),"message":"Driver created successfully"},
            201
        )
        return response
    
class DriverById(Resource):
    method_decorators = [token_required]
    def get(self,id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        driver=DriverService.findById(id)
        if driver:
            response=make_response(
                jsonify(driver.to_dict()),
                200
            )
  
            return response
        return make_response(jsonify({'message':'driver not found'}),404)
    
    def post(self,id):
        data=request.get_json()
        action=data['action']
        owner_id=data['owner_id']
        bus_id=data['bus_id']

        if not action or not bus_id:
            return {"error": "Missing 'action' or 'bus_id'"}, 400
        
        # check if driver exists
        driver = DriverService.findById(id)
        if not driver:
            return {"error": f"Driver with ID {id} not found"}, 404

        # check if bus exists
        bus = BusService.findById(id=bus_id)
        if not bus:
            return {"error": f"Bus with ID {bus_id} not found"}, 404
        # check if owner exists 
        if action == 'assign':
            if not owner_id:
                return {"error": "Missing 'owner_id' for assignment"}, 400

            owner = OwnerService.findById(id=owner_id)
            if not owner:
                return {"error": f"Owner with ID {owner_id} not found"}, 404

            bus.driver_id = id
            db.session.commit()
            return {"message": f"Driver {driver.driver_name} assigned to bus {bus_id}"}, 200
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
            price=data["price"]
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

        new_location = LocationService.createLocation(location_name, latitude, longitude)
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
api.add_resource(Drivers, '/api/drivers')
api.add_resource(DriverById, '/api/drivers/<int:id>')
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
    app.run(port=5555, debug=True)
