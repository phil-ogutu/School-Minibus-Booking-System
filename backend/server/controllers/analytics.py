from middleware.auth import token_required
from service import BusService, UserService, RouteService,BookingService, LocationService
from flask import make_response, jsonify, request, g
from flask_restful import Resource
from config import db

class Analytics(Resource):
    method_decorators = [token_required]
    def get(self):
        parent_count = UserService.analytics(role='parent')
        routes_count = RouteService.analytics()
        buses_count = BusService.analytics()
        bookings_count = BookingService.analytics()
        locations_count = LocationService.analytics()
        return make_response(
            jsonify([
                {
                    'count': parent_count,
                    'label': 'parent'
                },
                {
                    'count': routes_count,
                    'label': 'route'
                },
                {
                    'count': buses_count,
                    'label': 'buses'
                },
                {
                    'count': bookings_count,
                    'label': 'bookings'
                },
                {
                    'count': locations_count,
                    'label': 'locations'
                }
            ]),
            200        
        )