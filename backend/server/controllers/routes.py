from middleware.auth import token_required
from service import RouteService, LocationService
from flask import make_response, jsonify, request, g
from flask_restful import Resource
from config import db

class Routes(Resource):
    method_decorators = [token_required]
    def get(self):
        query = request.args.get('query')
        page = request.args.get('page')
        routes = RouteService.findAll(query,page)
        return make_response(
            jsonify(routes),
            200        
        )

    def post(self):
        data = request.get_json()
        new_route = RouteService.createRoute(
            start=data["start"],
            end=data["end"],
            stops=data["stops"]
        )
        
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
