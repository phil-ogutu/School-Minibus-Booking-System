from middleware.auth import token_required
from service import DriverService, BusService, OwnerService, UserService
from flask import make_response, jsonify, request, g
from flask_restful import Resource
from config import db

class Users(Resource):
    method_decorators = [token_required]
    def get(self,role):
        query = request.args.get('query')
        users = UserService.findAll(role,query)
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
    
