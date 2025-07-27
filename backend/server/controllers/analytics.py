from middleware.auth import token_required
from service import AuthService, UserService
from flask import make_response, jsonify, request, g
from flask_restful import Resource
from config import db

class Analytics(Resource):
    method_decorators = [token_required]
    def get(self):
        parent_count = UserService.analytics(role='parent')
        return make_response(
            jsonify([{
                'count': parent_count,
                'label': 'parent'
            }]),
            200        
        )