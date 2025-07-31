from middleware.auth import token_required
from service import DriverService, BusService, OwnerService, UserService
from flask import make_response, jsonify, request
from flask_restful import Resource
from config import db

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
        email = data['email']
        mobile = data['mobile']
        id_number = data['id_number']
        rating = 0
        bio=''

        if driver_name == None:
            return make_response("Required Inputs are required", 400)
        
        new_driver = DriverService.createDriver(
            driver_name=driver_name,
            email=email,
            mobile=mobile,
            id_number=id_number,
            rating=rating,
            bio=bio,            
        )
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

class DriverTrips(Resource):
    def get(self, id):
        if id is None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        driver=DriverService.findById(id)
        if driver:
            buses = BusService.findAll(driver_id=id)
            response_body=jsonify(buses)
            return make_response(
                response_body,
                200
            )
        return make_response(jsonify({'message':'driver not found'}),404)
    

class DriverTripById(Resource):
    def get(self, id, trip_id):
        if id == None or trip_id == None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        driver=DriverService.findById(id)
        if driver:
            bus = BusService.findOne(id=trip_id)
            if bus:
              response_body=jsonify(bus.to_dict(rules=('-bookings','-routes.buses')))
              return make_response(
                response_body,
                200
              )
            return make_response(jsonify({'message':'bus not found'}),404)
        return make_response(jsonify({'message':'driver not found'}),404)
    
    def patch(self, id, trip_id):
        if id == None or trip_id == None:
            return make_response(jsonify({'message':'missing id parameter'}),400)
        
        data=request.get_json()
        driver=DriverService.findById(id)
        if driver:
            bus = BusService.findOne(id=trip_id)
            if bus:
                for attr in data:
                    print(data[attr])
                    setattr(bus,attr,data[attr])
                db.session.commit()
                response_body=jsonify(bus.to_dict(rules=('-bookings','-routes.buses')))
                return make_response(
                    response_body,
                    200
                )
            return make_response(jsonify({'message':'bus not found'}),404)
        return make_response(jsonify({'message':'driver not found'}),404)
        
