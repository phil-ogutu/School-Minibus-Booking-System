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
from controllers.routes import Routes, RouteById, TopRoutes, LocationById, Locations
from controllers.buses import BusById, Buses
from controllers.bookings import Bookings, BookingById
from controllers.fcm import SaveFcmToken, SendNotification
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

# New route for top searched routes


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
# Fcm endpoints
api.add_resource(SaveFcmToken, '/api/save-fcm-token')
api.add_resource(SendNotification, '/api/send-notification')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
