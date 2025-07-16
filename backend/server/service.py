from config import bcrypt
from models import db, User, Booking
import jwt

class UserService():
    def __init__(self):
        pass
    def findById(self,id):
        if not id == None:
            return User.query.filter_by(id=id).first()
        return None
    
    def findByEmail(self,email):
        if not email == None:
            return User.query.filter_by(email=email).first()
        return None
    
    def findByMobile(self,mobile):
        if not mobile == None:
            return User.query.filter_by(mobile=mobile).first()
        return None
    
    def createUser(self, username, mobile, email, password_hash, role):
        return User(
            username=username,
            email=email,
            mobile=mobile,
            restaurant_bio="",
            photo_url="",
            password_hash=password_hash,
            role=role
        )
    
    def findAll(self,):
        return [user.to_dict() for user in User.query.all()]
    
class AuthService():
    def __init__(self):
        pass

    def hashPassword(self,password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    def checkPassword(self,password,user_password):
        return bcrypt.checkpw(password.encode('utf-8'), user_password)
    
    def jwtTokenEncoder(self, body):
        return jwt.encode(body, 'secret', algorithm="HS256")
    
class BookingService():
    def __init__(self):
        pass

    def findAll(self):
        return [booking.to_dict() for booking in Booking.query.all()]
    
    def findOne(self,id):
        return Booking.query.filter_by(id=id).first()
    
