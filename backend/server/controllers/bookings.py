from middleware.auth import token_required
from service import BookingService 
from flask import make_response, jsonify, request, g
from flask_restful import Resource
from config import db

class Bookings(Resource):
    method_decorators = [token_required]
    def get(self):
        query=request.args.get('query')
        parent=request.args.get('parent')
        bookings = BookingService.findAll(query,parent)
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

