from service import AuthService, UserService
from flask import make_response, request
from flask_restful import Resource
from config import db

class Auth(Resource):
    def post(self):
        data=request.get_json()
        print('SIGNUP==========================================: ', data)
        action = data.get('action')


        username = data.get('username')
        email = data.get('email')
        mobile = data.get('mobile')
        role = data.get('role')
        password = data.get('password')

        if action == "register":
            if username == None and email == None and role == None and password == None:
                return make_response("Required Inputs are required", 400)
            
            if UserService.findByEmail(email):
                return make_response("This User already Exists", 400)
            
            password_hash = AuthService.hashPassword(password)
            new_user = UserService.createUser(username, mobile, email, password_hash, role)
            db.session.add(new_user)
            db.session.commit()

            encoded_jwt = AuthService.jwtTokenEncoder({"name": new_user.username,"id":new_user.id,"role":new_user.role.value})
            response=make_response(
                {"token":encoded_jwt,"message":"User created successfully"},
                201
            )
            response.set_cookie(
                'token',  # cookie name
                encoded_jwt,  # cookie value
                httponly=True,  # prevent JS access
                samesite='Lax',  # adjust depending on cross-site needs
                secure=False  # set to True if using HTTPS in production
            )
            return response
        elif action == "login":
            if email == None and password == None:
                return make_response("Required Inputs are required", 400)
            
            user = UserService.findByEmail(email)
            if not user:
                return make_response("This User does not exist", 400)
            
            if not AuthService.checkPassword(password, user.password_hash):
                return make_response("Wrong Credentials", 400)
            
            encoded_jwt = AuthService.jwtTokenEncoder({"name": user.username,"id":user.id,"role":user.role.value})
            response=make_response(
                {"token":encoded_jwt,"message":"User Logged in successfully"},
                201
            )
            response.set_cookie(
                'token',
                encoded_jwt,
                httponly=True,
                samesite='Lax',
                secure=False
            )
            return response
        else:
            response=make_response(
                {"message":"unknown auth action"},
                400
            )

    def delete(self):
        response = make_response({"message": "User logged out successfully"}, 200)
        response.set_cookie(
            'token',
            '',
            expires=0,
            httponly=True,
            samesite='Lax',
            secure=False
        )
        return response

