from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

from sqlalchemy import func # from sqlalchemy
from sqlalchemy import Enum
import enum


# Enum definitions
class UserRole(enum.Enum):
    parent = "parent"
    admin = "admin"

class RouteStatus(enum.Enum):
    pending = "pending"
    started = "started"
    ended = "ended"

# Models go here!

# Users Table
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    photo_url = db.Column(db.String)
    role = db.Column(Enum(UserRole), nullable=False)
    created_at = db.Column(db.DateTime(), server_default= func.now())

# Bookings Table
class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # FK for parent (user_id)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'))  # FK for bus
    title = db.Column(db.String)
    child_name = db.Column(db.String)
    pickup = db.Column(db.String)
    dropoff = db.Column(db.String)
    price = db.Column(db.Float)
    status = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime(), server_default= func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now())

# Buses Table
class Bus(db.Model):
    __tablename__ = 'buses'
    
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))  # FK for route
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'))  # FK for driver
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))  # FK for owner
    plate = db.Column(db.String)
    capacity = db.Column(db.String)
    status = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime(), server_default= func.now())

#Driver Table
class Driver(db.Model):
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)
    driver_name = db.Column(db.String, nullable=False)

    buses = db.relationship("Bus", backref="driver", lazy=True)


#Owner Table
class Owner(db.Model):
    __tablename__ = 'owners'

    id=db.Column(db.Integer, primary_key=True)
    owner_name=db.Column(db.String, nullable=False)

#Route Table
class Route(db.Model):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String, nullable=False)
    end = db.Column(db.String, nullable=False)
    status = db.Column(Enum(RouteStatus), default=RouteStatus.pending)
    created_at = db.Column(db.DateTime(), server_default=func.now())

#Location Table
class Location(db.Model):
    __tablename__ = 'location'

    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))
    location_name = db.Column(db.String, nullable=False)
    GPS = db.Column(db.String)



