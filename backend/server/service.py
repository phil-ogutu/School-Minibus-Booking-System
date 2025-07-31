import bcrypt
from models import db, User, Booking, Driver, Owner, Bus, TripStatus, Route, Location, Contact
import jwt
from flask import abort
from sqlalchemy import or_
from datetime import datetime


class UserService():
    @staticmethod
    def findById(id):
        if not id == None:
            return User.query.filter_by(id=id).first()
        return None
    
    @staticmethod
    def findByEmail(email):
        if not email == None:
            return User.query.filter_by(email=email).first()
        return None
    
    @staticmethod
    def findByMobile(mobile):
        if not mobile == None:
            return User.query.filter_by(mobile=mobile).first()
        return None
    
    @staticmethod
    def createUser( username, mobile, email, password_hash, role):
        return User(
            username=username,
            email=email,
            mobile=mobile,
            photo_url="",
            password_hash=password_hash,
            role=role
        )
    
    @staticmethod
    def findAll(role='',query='',page=1):
        offset = (int(page) - 1) * 10
        if role:
            if query:
                users = User.query.filter(
                    User.role == role,
                    or_(
                        User.username.ilike(f'%{query}%'),
                        User.email.ilike(f'%{query}%'),
                        User.mobile.ilike(f'%{query}%')
                    )
                ).limit(10).offset(offset).all()
                return [user.to_dict(rules=('-password_hash','-bookings')) for user in users]
            else:
                return [user.to_dict(rules=('-password_hash','-bookings')) for user in User.query.filter_by(role=role).limit(10).offset(offset).all()]
        else:
            return [user.to_dict(rules=('-password_hash',)) for user in User.query.limit(10).offset(offset).all()]
        
    @staticmethod
    def analytics(role=''):
        if role:
            return User.query.filter_by(role=role).count()
        else:
            return User.query.count()
    
class DriverService():
    @staticmethod
    def findById(id):
        if not id == None:
            return Driver.query.filter_by(id=id).first()
        return None
    
    @classmethod
    def createDriver(cls,driver_name,email,mobile,id_number,rating,bio ):
        if cls.findOne(id_number=id_number):
            abort(400,'This driver already exists')
        return Driver(
            driver_name=driver_name,
            email=email,
            mobile=mobile,
            id_number=id_number,
            rating=rating,
            bio=bio
        )
    
    @staticmethod
    def findAll(query='',page=1):
        offset = (int(page) - 1) * 10
        if query:
            return [driver.to_dict() for driver in Driver.query.filter(Driver.driver_name.ilike(f'%{query}%'),).limit(10).offset(offset).all()]
        return [driver.to_dict() for driver in Driver.query.limit(10).offset(offset).all()]
    
    @staticmethod
    def findOne(id=None,driver_name=None,id_number=None):
        if id:
            return Driver.query.filter_by(id=id).first()
        if id_number:
            return Driver.query.filter_by(id_number=id_number).first()
        elif driver_name:
            return Driver.query.filter_by(driver_name=driver_name).first()
        else:
            return None
        
class OwnerService():
    @staticmethod
    def findById(id):
        if not id == None:
            return Owner.query.filter_by(id=id).first()
        return None
    
    @staticmethod
    def createOwner( owner_name ):
        return Owner(
            owner_name=owner_name
        )
    
    @staticmethod
    def findAll(query=''):
        if query:
            return [owner.to_dict() for owner in Owner.query.filter(Owner.owner_name.ilike(f'%{query}%')).all()]    
        return [owner.to_dict() for owner in Owner.query.all()]
    
    @staticmethod
    def findOne(id,owner_name):
        if id:
            return Owner.query.filter_by(id=id).first()
        elif owner_name:
            return Owner.query.filter_by(owner_name=owner_name).first()
        else:
            return None
    
class AuthService():
    @staticmethod
    def hashPassword(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    @staticmethod
    def checkPassword(password,user_password):
        return bcrypt.checkpw(password.encode('utf-8'), user_password)
    @staticmethod
    def jwtTokenEncoder(body):
        return jwt.encode(body, 'secret', algorithm="HS256")
    
class BookingService():
    @staticmethod
    def findAll(query='',parent='',page=1):
        offset = (int(page) - 1) * 10
        if parent:
            if query:
                bookings = Booking.query.filter(
                    Booking.parent_id == parent,
                    or_(
                        Booking.child_name.ilike(f'%{query}%'),
                        Booking.pickup.ilike(f'%{query}%'),
                        Booking.dropoff.ilike(f'%{query}%')
                    )
                ).limit(10).offset(offset).all()
            return [booking.to_dict() for booking in Booking.query.filter_by(parent_id=int(parent)).limit(10).offset(offset).all()] 
        if query:
            bookings = Booking.query.filter(
                or_(
                    Booking.child_name.ilike(f'%{query}%'),
                    Booking.pickup.ilike(f'%{query}%'),
                    Booking.dropoff.ilike(f'%{query}%')
                )
            ).limit(10).offset(offset).all()
            return [booking.to_dict() for booking in bookings]
        return [booking.to_dict() for booking in Booking.query.limit(10).offset(offset).all()]
    
    @staticmethod
    def findOne(id):
        return Booking.query.filter_by(id=id).first()
    
    @staticmethod
    def createBooking(parent_id, bus_id, title, child_name, pickup, dropoff, price):
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
            price=price,
        )
    @staticmethod
    def analytics():
        return Booking.query.count()

    
class BusService():
    @staticmethod
    def findAll(driver_id=None, query='',date=None,page=1):
        offset = (int(page) - 1) * 10
        dbQuery = Bus.query

        if driver_id:
            dbQuery = dbQuery.filter_by(driver_id=driver_id)

        if query:
            dbQuery = dbQuery.filter(Bus.plate.ilike(f"%{query}%"))
        
        if date:
            dbQuery = dbQuery.filter(Bus.departure == date)

        return [bus.to_dict(rules=('-routes.buses', )) for bus in dbQuery.limit(10).offset(offset).all()]
    
    @staticmethod
    def findOne(id=None, plate=None):
        if id:
            return Bus.query.filter_by(id=id).first()
        if plate:
            return Bus.query.filter_by(plate=plate).first()
        return None
    
    @staticmethod
    def findById(id):
        if id:
            return Bus.query.filter_by(id=id).first()
        return None
    
    @classmethod
    def createBus(cls,route_id, driver_id, owner_id, plate, capacity, departure):
        existing_bus = cls.findOne(plate=plate)
        if existing_bus:
            abort(400, description="This bus already exists")

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
            route_id=int(route_id),
            driver_id=int(driver_id),
            owner_id=int(owner_id),
            plate=plate,
            capacity=int(capacity),
            departure=datetime.fromisoformat(departure),
            status=TripStatus.pending
        )
    @staticmethod
    def analytics():
        return Bus.query.count()
    
class RouteService():
    @staticmethod
    def findAll(query='',page=1):  
        offset = (int(page or 1) - 1) * 10 
        if query:
            routes = Route.query.filter(
                or_(
                    Route.start.ilike(f'%{query}%'),
                    Route.end.ilike(f'%{query}%'),
                )
            ).limit(10).offset(offset).all()
            return [route.to_dict() for route in routes]
        else:
            return [route.to_dict() for route in Route.query.limit(10).offset(offset).all()]
    
    @staticmethod
    def findById(id):
        if id:
            return Route.query.filter_by(id=id).first()
        return None
    
    # Increment count on search
    @staticmethod
    def findOne(id=None, start=None, end=None, increment_search=False):
        route = None

        if id:
            route = Route.query.filter_by(id=id).first()
        elif start and end:
            route = Route.query.filter_by(start=start, end=end).first()
        elif start:
            route = Route.query.filter_by(start=start).first()
        elif end:
            route = Route.query.filter_by(end=end).first()

        if route and increment_search:
            route.search_count += 1
            db.session.commit()

        return route
    
    # Get mostly searched routes
    @staticmethod
    def getTopSearched(limit=6):
        routes = (
            Route.query
            .order_by(Route.search_count.desc())
            .limit(limit)
            .all()
        )
        return [route.to_dict() for route in routes]
    
    @classmethod
    def createRoute(cls,start, end, stops ):
        if not start or not end:
            abort(400, description="Missing required fields: 'start' and 'end'")

        existing_route = cls.findOne(
            id=None, start=start, end=end
        )
        if existing_route:
            abort(400, description="Route with the same start and end already exists")

        new_route = Route(
            start=start,
            end=end
        )
        db.session.add(new_route)
        db.session.commit()

        # for stop in stops
        for stop in stops:
            location = LocationService.createLocation(
                latitude=stop['latitude'],
                longitude=stop['longitude'],
                location_name=stop['location_name'],
                route_id=new_route.id,
            )
            db.session.add(location)
            db.session.commit()

        return new_route
    
    @staticmethod
    def analytics():
        return Route.query.count()
    
class LocationService():
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
    def createLocation(cls,location_name, latitude, longitude, route_id ):
        if not location_name or not latitude or not longitude or not route_id:
            abort(400, description="Missing required fields: 'location_name' and 'latitude' and 'longitude' and 'route_id'")

        existing_location = cls.findOne(
            id=None, location_name=None,
            latitude=latitude, longitude=longitude
        )
        if existing_location:
            abort(400, description="location with the same longitude and latitude already exists")
            
        return Location(
            latitude=latitude,
            longitude=longitude,
            location_name=location_name,
            route_id=route_id
        )
    
    @staticmethod
    def analytics():
        return Location.query.count()

      
class ContactService:
    @staticmethod
    def create_contact(name, email, mobile, role, subject, message):
        contact = Contact(name=name, email=email, mobile=mobile, role=role, subject=subject, message=message)
        db.session.add(contact)
        db.session.commit()
        return contact

    @staticmethod
    def get_all_contacts(query=None):
        if query:
            return Contact.query.filter(Contact.name.ilike(f"%{query}%")).all()
        return Contact.query.all()

    @staticmethod
    def find_by_id(contact_id):
        return Contact.query.get(contact_id)

    @staticmethod
    def delete_contact(contact):
        db.session.delete(contact)
        db.session.commit()
