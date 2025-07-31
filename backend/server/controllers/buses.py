from middleware.auth import token_required
from service import BusService 
from flask import make_response, jsonify, request, g
from flask_restful import Resource
from config import db
from datetime import datetime

class Buses(Resource):
    method_decorators = [token_required]
    def post(self):
        data = request.get_json()

        new_bus = BusService.createBus(
            route_id=data["route_id"],
            driver_id=data["driver_id"],
            owner_id=data["owner_id"],
            plate=data["plate"],
            capacity=data["capacity"],
            departure=data["departure"]
        )

        db.session.add(new_bus)
        db.session.commit()
        response=make_response(
            {"bus":new_bus.to_dict(),"message":"Bus created successfully"},
            201
        )
        return response

    def get(self):
        query=request.args.get('query')
        page=request.args.get('page')
        buses = BusService.findAll(query,page)
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
                if(attr == 'departure'):
                    data[attr] = datetime.fromisoformat(data[attr])

                    setattr(bus,attr,data[attr])
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

