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

from controllers.drivers import Drivers, DriverById, DriverTrips, DriverTripById
from controllers.auth import Auth
from controllers.users import Users, UserById, CurrentUser
from controllers.analytics import Analytics
# Local imports
from config import app, db, api
from middleware.auth import token_required

# Add your model imports

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
api.add_resource(Users, '/api/users/<string:role>')
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
#  Analytics endpoint
api.add_resource(Analytics, '/api/analytics')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
