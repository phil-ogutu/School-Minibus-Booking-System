from config import bcrypt
from models import db, User, Booking, Driver, Owner, Bus, Route, Location
import jwt
from flask import abort

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
    
class DriverService():
    def __init__(self):
        pass

    def findById(self,id):
        if not id == None:
            return Driver.query.filter_by(id=id).first()
        return None
    
    def createDriver(self, driver_name ):
        return Driver(
            driver_name=driver_name
        )
    
    def findAll(self,):
        return [driver.to_dict() for driver in Driver.query.all()]
    
    def findOne(self,id,driver_name):
        if id:
            return Driver.query.filter_by(id=id).first()
        elif driver_name:
            return Driver.query.filter_by(driver_name=driver_name).first()
        else:
            return None
        
class OwnerService():
    def __init__(self):
        pass

    def findById(self,id):
        if not id == None:
            return Owner.query.filter_by(id=id).first()
        return None
    
    def createOwner(self, owner_name ):
        return Owner(
            owner_name=owner_name
        )
    
    def findAll(self,):
        return [owner.to_dict() for owner in Owner.query.all()]
    
    def findOne(self,id,owner_name):
        if id:
            return Owner.query.filter_by(id=id).first()
        elif owner_name:
            return Owner.query.filter_by(owner_name=owner_name).first()
        else:
            return None
    
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
    
    @staticmethod
    def createBooking(self, parent_id, bus_id, title, child_name, pickup, dropoff, price):
        parent = UserService.findById(id=parent_id)
        if not parent:
            abort(400, description="Invalid parent_id: parent not found")

        bus = BusService.findOne(id=bus_id)
        if not bus:
            abort(400, description="Invalid bus_id: bus not found")
        if not bus.status:
            abort(400, description="Bus is not avaible for booking")

        if not isinstance(price, float):
            abort(400, description="Invalid Price Input")

        return Booking(
            parent_id=parent_id,
            bus_id=bus_id,
            title=title,
            child_name=child_name,
            pickup=pickup,
            dropoff=dropoff,
            price=price
        )
    
class BusService():
    def __init__(self):
        pass

    @staticmethod
    def findAll():
        return [bus.to_dict() for bus in Bus.query.all()]
    
    @staticmethod
    def findOne(id, plate):
        if id:
            return Bus.query.filter_by(id=id).first()
        if plate:
            return Bus.query.filter_by(plate=plate).first()
        return None
    
    @classmethod
    def createBus(cls,route_id, driver_id, title, owner_id, plate, capacity):
        owner = OwnerService.findById(id=owner_id)
        if not owner:
            abort(400, description="Invalid owner_id: owner not found")

        driver = DriverService.findById(id=driver_id)
        if not driver:
            abort(400, description="Invalid driver_id: driver not found")

        route = RouteService.findById(id=route_id)
        if not route:
            abort(400, description="Invalid route_id: route not found")

        bus = cls.findOne(plate=plate)
        if bus:
            abort(400, description="A bus with this plate number already exists")

        return Bus(
            route_id=route_id,
            driver_id=driver_id,
            title=title,
            owner_id=owner_id,
            plate=plate,
            capacity=capacity
        )
    
class RouteService():
    def __init__(self):
        pass

    @staticmethod
    def findAll():
        return [route.to_dict() for route in Route.query.all()]
    
    @staticmethod
    def findOne(id=None, start=None, end=None):
        if id:
            return Route.query.filter_by(id=id).first()
        if start and end:
            return Route.query.filter_by(start=start, end=end).first()
        if start:
            return Route.query.filter_by(start=start).first()
        if end:
            return Route.query.filter_by(end=end).first()
        return None
    
    
    @classmethod
    def createRoute(cls,start, end ):
        if not start or not end:
            abort(400, description="Missing required fields: 'start' and 'end'")

        existing_route = cls.findOne(
            id=None, plate=None,
            start=start, end=end
        )
        if existing_route:
            abort(400, description="Route with the same start and end already exists")

        return Route(
            start=start,
            end=end
        )
    
class LocationService():
    def __init__(self):
        pass

    @staticmethod
    def findAll():
        return [location.to_dict() for location in Location.query.all()]
    
    @staticmethod
    def findOne(id=None, location_name=None, latitude=None, longitude=None):
        if id:
            return Location.query.filter_by(id=id).first()
        if location_name:
            return Location.query.filter_by(location_name=location_name).first()
        if latitude and longitude:
            return Location.query.filter_by(latitude=latitude, longitude=longitude).first()
        if latitude:
            return Location.query.filter_by(latitude=latitude).first()
        if longitude:
            return Location.query.filter_by(longitude=longitude).first()
        return None
    
    
    @classmethod
    def createLocation(cls,location_name, latitude, longitude ):
        if not location_name or not latitude or not longitude:
            abort(400, description="Missing required fields: 'location_name' and 'latitude' and 'longitude'")

        existing_location = cls.findOne(
            id=None, location_name=None,
            latitude=latitude, longitude=longitude
        )
        if existing_location:
            abort(400, description="location with the same longitude and latitude already exists")
            
        return Location(
            latitude=latitude,
            longitude=longitude,
            location_name=location_name
        )
