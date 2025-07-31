from flask_restful import Resource
from flask import request, jsonify, make_response
from middleware.auth import token_required
from service import ContactService

class Contacts(Resource):
    method_decorators = [token_required]

    def get(self):
        query = request.args.get('query')
        contacts = ContactService.get_all_contacts(query)
        return make_response(jsonify([c.to_dict() for c in contacts]), 200)

    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        mobile = data.get('mobile')
        role = data.get('role')
        subject = data.get('subject')
        message = data.get('message')

        # Validation
        if not name or not email or not subject or not message:
            return make_response(jsonify({"error": "Name, email, subject, and message are required"}), 400)

        contact = ContactService.create_contact(name, email, mobile, role, subject, message)
        return make_response(jsonify({"contact": contact.to_dict(), "message": "Feedback submitted successfully"}), 201)


class ContactById(Resource):
    method_decorators = [token_required]

    def get(self, id):
        contact = ContactService.find_by_id(id)
        if contact:
            return make_response(jsonify(contact.to_dict()), 200)
        return make_response(jsonify({"message": "Contact not found"}), 404)

    def delete(self, id):
        contact = ContactService.find_by_id(id)
        if contact:
            ContactService.delete_contact(contact)
            return make_response(jsonify({"message": f"Contact ID {id} deleted successfully"}), 200)
        return make_response(jsonify({"message": "Contact not found"}), 404)
