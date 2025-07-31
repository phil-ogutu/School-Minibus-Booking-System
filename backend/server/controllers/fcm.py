from flask import request, jsonify, make_response
from flask_restful import Resource
from firebase_admin import messaging
from config import db
from service import UserService, NotificationService       

class SaveFcmToken(Resource):
    def post(self):
        data = request.get_json()
        token = data.get("token")
        user_id = data.get("user_id")  

        if not token or not user_id:
            return make_response(jsonify({"error": "Token and user_id are required"}), 400)

        NotificationService(user_ids=[user_id]).saveFcmToken(fcm_token=token)

        return make_response(jsonify({"message": "Token saved successfully"}), 200)
    
class SendNotification(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")
        title = data.get("title", "Notification")
        body = data.get("body", "You have an update")

        response = NotificationService(user_ids=[user_id], title=title, body=body).sendFcmNotification()

        return make_response(jsonify({"message": "Notification sent", "id": response}), 200)
