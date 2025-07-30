from flask import request, jsonify, make_response
from flask_restful import Resource
from firebase_admin import messaging
from config import db          

class SaveFcmToken(Resource):
    def post(self):
        data = request.get_json()
        token = data.get("token")
        user_id = data.get("user_id")  

        if not token or not user_id:
            return make_response(jsonify({"error": "Token and user_id are required"}), 400)

        from models import User  
        user = User.query.get(user_id)

        if not user:
            return make_response(jsonify({"error": "User not found"}), 404)

        user.fcm_token = token
        db.session.commit()

        return make_response(jsonify({"message": "Token saved successfully"}), 200)
    
class SendNotification(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")
        title = data.get("title", "Notification")
        body = data.get("body", "You have an update")

        from models import User
        user = User.query.get(user_id)

        if not user or not user.fcm_token:
            return make_response(jsonify({"error": "User not found or token missing"}), 404)

        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=user.fcm_token
        )

        response = messaging.send(message)
        return make_response(jsonify({"message": "Notification sent", "id": response}), 200)

