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
    started = "started"
    ended = "ended"

class RouteStatus(enum.Enum):
    pending = "pending"
    started = "started"
    ended = "ended"

# Models go here!

# Users Table
class User(db.Model,SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-bookings.parent',)
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    photo_url = db.Column(db.String)
    role = db.Column(Enum(UserRole), nullable=False)
    fcm_token = db.Column(db.String)
    created_at = db.Column(db.DateTime(), server_default= func.now())

    bookings = db.relationship("Booking", back_populates="parent")


# Bookings Table
class Booking(db.Model,SerializerMixin):
    __tablename__ = 'bookings'
    serialize_rules = ('-parent.bookings', '-bus.bookings')
    
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
    
    parent = db.relationship("User", back_populates="bookings")
    bus = db.relationship("Bus", back_populates="bookings")

# Buses Table
class Bus(db.Model,SerializerMixin):
    __tablename__ = 'buses'
    serialize_rules = ('-bookings.bus','-routes.bus','-driver.bus')
    
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'))  # FK for route
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'))  # FK for driver
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))  # FK for owner
    plate = db.Column(db.String, unique=True)
    capacity = db.Column(db.Integer)
    status = db.Column(Enum(TripStatus), default=TripStatus.pending)
    created_at = db.Column(db.DateTime(), server_default= func.now())
    arrived = db.Column(db.DateTime(),nullable=True)
    departure = db.Column(db.DateTime(),nullable=True)
    tracking_room = db.Column(db.String())

    bookings = db.relationship("Booking", back_populates="bus")
    routes = db.relationship("Route", back_populates="buses")
    driver=db.relationship('Driver', back_populates="bus")

#Driver Table
class Driver(db.Model,SerializerMixin):
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)
    driver_name = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String)
    id_number = db.Column(db.String)
    email = db.Column(db.String)
    bio = db.Column(db.String)
    rating = db.Column(db.Float)

    bus = db.relationship("Bus", back_populates="driver")

#Owner Table
class Owner(db.Model,SerializerMixin):
    __tablename__ = 'owners'
    serialize_rules = ('-buses.routes','-locations.routes')

    id=db.Column(db.Integer, primary_key=True)
    owner_name=db.Column(db.String, nullable=False)

    # buses = db.relationship("Bus", back_populates="owner")

#Route Table
class Route(db.Model,SerializerMixin):
    __tablename__ = 'routes'
    serialize_rules = ('-buses.routes','-locations.routes')

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String, nullable=False)
    end = db.Column(db.String, nullable=False)
    status = db.Column(Enum(RouteStatus), default=RouteStatus.pending)
    created_at = db.Column(db.DateTime(), server_default=func.now())
    search_count = db.Column(db.Integer, default=0)

    buses = db.relationship("Bus", back_populates="routes")
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

class Contact(db.Model,SerializerMixin):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    mobile = db.Column(db.String, nullable=False)
    role = db.Column(Enum(UserRole), nullable=False)
    subject = db.Column(db.String, nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(), server_default= func.now())

# Payment Status Enum
class PaymentStatus(enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

# Payment Table
class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'
    # serialize_rules = ('-booking.payment_transactions',)

    id = db.Column(db.Integer, primary_key=True)

    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    mpesa_code = db.Column(db.String(50), unique=True, index=True, nullable=True)  # e.g. STK-123456

    amount = db.Column(db.Float, nullable=False)

    status = db.Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, index=True)  # PENDING | PAID | FAILED

    paid_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now())

    # Relationship
    # booking = db.relationship ("Booking", back_populates="payments")