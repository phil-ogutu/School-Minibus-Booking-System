from middleware.auth import token_required
from service import OwnerService
from flask import make_response, jsonify, request
from flask_restful import Resource
from config import db

class Owners(Resource):
    method_decorators = [token_required]
    def get(self):
        query=request.args.get('query')
        owners = OwnerService.findAll(query)
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