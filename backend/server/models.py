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
    driver = "driver"

class TripStatus(enum.Enum):
    pending = "pending"
    rescheduled = "rescheduled"
    started = "started"
    ended = "ended"

class RouteStatus(enum.Enum):
    pending = "pending"
    started = "started"
    ended = "ended"

# Users Table
class User(db.Model,SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    photo_url = db.Column(db.String)
    role = db.Column(Enum(UserRole), nullable=False)
    created_at = db.Column(db.DateTime(), server_default= func.now())

class Admin(db.Model,SerializerMixin):
    __tablename__='admins'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Parent(db.Model,SerializerMixin):
    __tablename__='parents'
    serialize_rules = ('-bookings.parent',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    bookings = db.relationship("Booking", back_populates="parent")

class Driver(db.Model,SerializerMixin):
    __tablename__='drivers'
    serialize_rules = ('-trips.driver',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    trips = db.relationship("Trip", back_populates="driver")

class Owner(db.Model,SerializerMixin):
    __tablename__ = 'owners'
    serialize_rules = ('-buses.routes','-locations.routes')

    id=db.Column(db.Integer, primary_key=True)
    owner_name=db.Column(db.String, nullable=False)

    buses=db.relationship("Bus",back_populates="owner")

# Bookings Table
class Booking(db.Model,SerializerMixin):
    __tablename__ = 'bookings'
    serialize_rules = ('-parent.bookings', '-trip.bookings')
    
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.id'))  # FK for parent (user_id)
    student_name = db.Column(db.String)
    student_number = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))  # FK for bus
    title = db.Column(db.String)
    pickup = db.Column(db.String)
    dropoff = db.Column(db.String)
    price = db.Column(db.Float)
    status = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime(), server_default= func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now())
    
    parent = db.relationship("Parent", back_populates="bookings")
    trip = db.relationship("Trip", back_populates="trips")

# Trips Table
class Trip(db.Model,SerializerMixin):
    __tablename__ = 'trips'
    serialize_rules = ('-bookings.trip','-driver.trips','-route.trips','bus.trips')
    
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'))  # FK for driver
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'))  # FK for bus
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))  # FK for route

    status = db.Column(Enum(TripStatus), default=TripStatus.pending)
    arrived = db.Column(db.DateTime())
    departure = db.Column(db.DateTime())
    created_at = db.Column(db.DateTime(), server_default= func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now())

    bookings = db.relationship("Booking", back_populates="trip")
    route = db.relationship("Route", back_populates="trips")
    driver = db.relationship('Driver', back_populates="trips")
    bus = db.relationship('Bus', back_populates="trips")

class Bus(db.Model,SerializerMixin):
    __tablename__= 'buses'
    serialize_rules = ('-trips.bus','-owner.buses')

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))  # FK for owner
    plate = db.Column(db.String, unique=True)
    capacity = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(), server_default= func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now())
    status=db.Column(db.Boolean, default=True)

    owner = db.relationship('Owner', back_populates='bus')
    trips = db.relationship('Trip', back_populates='bus')

#Route Table
class Route(db.Model,SerializerMixin):
    __tablename__ = 'routes'
    serialize_rules = ('-trips.route','-locations.routes')

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String, nullable=False)
    end = db.Column(db.String, nullable=False)
    status = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(), server_default=func.now())
    search_count = db.Column(db.Integer, default=0)

    trips = db.relationship("Trip", back_populates="routes")
    locations = db.relationship("Location", back_populates="routes")

#Location Table
class Location(db.Model,SerializerMixin):
    __tablename__ = 'locations'
    serialize_rules = ('-routes.locations',)

    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))
    location_name = db.Column(db.String, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    routes = db.relationship("Route", back_populates="locations")