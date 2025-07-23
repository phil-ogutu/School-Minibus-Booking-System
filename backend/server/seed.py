#!/usr/bin/env python3
from random import randint, choice as rc
# Remote library imports
from faker import Faker
from config import bcrypt, app, db
from models import (
    User, Parent, Driver, Admin, Owner, 
    UserRoleEnum, TripStatusEnum, BookingStatusEnum, 
    Booking, Trip, Bus,
    Location, Route
)

dummy_data = [
    [
        { "lat": -1.105225, "lng": 37.016789, "name": "JKUAT Entry road" },
        { "lat": -1.120837, "lng": 37.008421, "name": "Thika Super Highway, Kalimoni" }, 
        { "lat": -1.131100, "lng": 36.981719, "name": "Rubis Kimbo Service Station" }
    ],
    [
        { "lat": -1.105225, "lng": 37.016789, "name": "JKUAT Entry Road" },
        { "lat": -1.117500, "lng": 37.011100, "name": "Kalimoni Junction" },
        { "lat": -1.124200, "lng": 37.002300, "name": "Weitethie Stage" },
        { "lat": -1.138300, "lng": 36.991900, "name": "Kimbo Bus Stop" },
        { "lat": -1.208500, "lng": 36.899100, "name": "Roysambu Stage" }
    ],
    [
        { "lat": -1.033500, "lng": 37.070200, "name": "Thika Main Stage" },
        { "lat": -1.041300, "lng": 37.054600, "name": "Makongeni" },
        { "lat": -1.065900, "lng": 37.034000, "name": "Kiganjo" },
        { "lat": -1.078800, "lng": 37.025500, "name": "Kalimoni Highrise" },
        { "lat": -1.100000, "lng": 37.015000, "name": "Juja Farm Junction" },
        { "lat": -1.120000, "lng": 37.005000, "name": "Weitethie" },
        { "lat": -1.140000, "lng": 36.995000, "name": "Ruiru Bypass" },
        { "lat": -1.175000, "lng": 36.940000, "name": "Githurai 45" },
        { "lat": -1.210000, "lng": 36.920000, "name": "Kasarani" },
        { "lat": -1.284100, "lng": 36.815600, "name": "Nairobi CBD" }
    ],
    [
        { "lat": -1.292100, "lng": 36.821900, "name": "Kencom Stage" },
        { "lat": -1.286000, "lng": 36.828400, "name": "GPO" },
        { "lat": -1.281700, "lng": 36.837800, "name": "Ngara Market" },
        { "lat": -1.266700, "lng": 36.844400, "name": "Parklands Avenue" },
        { "lat": -1.258000, "lng": 36.857000, "name": "Westlands Stage" },
        { "lat": -1.252500, "lng": 36.868700, "name": "Sarit Centre" },
        { "lat": -1.245800, "lng": 36.874200, "name": "Rhapta Road" },
        { "lat": -1.238600, "lng": 36.882900, "name": "Kangemi" },
        { "lat": -1.241100, "lng": 36.897500, "name": "Mountain View" },
        { "lat": -1.250000, "lng": 36.915000, "name": "Uthiru" }
    ],
]

if __name__ == '__main__':
    fake = Faker()

    # Helper function to generate random users
    def create_user(role):
        return User(
            username=fake.user_name(),
            email=fake.email(),
            mobile=fake.phone_number(),
            password_hash=bcrypt.generate_password_hash(fake.password()).decode('utf-8'),  # Generating a fake password hash (for example purposes)
            photo_url=fake.image_url(),
            role=role,
            created_at=fake.date_this_year()  # Random date within this year
        )

    def create_parent(user_id):
        return Parent(
            user_id=user_id,
        )
    
    def create_driver(user_id):
        return Driver(
            user_id=user_id,
        )
    
    def create_admin(user_id):
        return Admin(
            user_id=user_id,
        )
    
    # Helper function to generate random buses
    def create_bus(owner_id):
        return Bus(
            owner_id=owner_id,
            plate=fake.license_plate(),
            capacity=str(randint(10, 50)),  # Random capacity between 10 and 50
            created_at=fake.date_this_year(),
        )
    
    def create_trip(driver_id,bus_id, route_id):
        return Trip(
            driver_id=driver_id,
            bus_id=bus_id,
            route_id=route_id,
            arrived=fake.date_this_year(),
            departure=fake.date_this_year(),
        )

    # Helper function to generate random bookings
    def create_booking(parent_id, trip_id):
        return Booking(
            parent_id=parent_id,
            trip_id=trip_id,
            title=fake.bs(),
            student_name=fake.name(),
            student_number=fake.name(),
            pickup=fake.city(),
            dropoff=fake.city(),
            price=round(randint(1000, 5000) / 100, 2),  # Random price between 10.00 and 50.00
            status=rc([BookingStatusEnum.assigned, BookingStatusEnum.pending, BookingStatusEnum.boarded, BookingStatusEnum.completed]),
            created_at=fake.date_this_year(),
            updated_at=fake.date_this_year()
        )

    # Helper function to generate random locations
    def create_location(route_id, longitude, latitude, name):
        return Location(
            route_id=route_id,
            location_name=name,
            longitude=str(longitude),
            latitude=str(latitude)
        )


    # Helper function to generate random owners
    def create_owner():
        return Owner(
            owner_name=fake.company()
        )

    # Helper function to generate random routes
    def create_route():
        return Route(
            start=fake.city(),
            end=fake.city(),
            created_at=fake.date_this_year()
        )

    with app.app_context():
        print("Dropping and recreating all tables...")
        db.drop_all()
        db.create_all()

        print("Starting seed...")
        # Seed code goes here!
        
        # Seed Users
        print("Seeding Users...")
        users = []
        drivers = []
        parents = []
        admins = []
        roles = (
            ['parent'] * 10 +
            ['driver'] * 5 +
            ['admin'] * 5
        )
        # Let's create 10 users
        for role in roles:
            user = create_user(role)
            db.session.add(user)
            db.session.commit()
            if role == 'parent':
                parent = create_parent(user.id)
                db.session.add(parent)
                parents.append(parent)
            if role == 'admin':
                admin = create_admin(user.id)
                db.session.add(admin)
                admins.append(admin)
            if role == 'driver':
                driver = create_driver(user.id)
                db.session.add(driver)
                drivers.append(driver)

            db.session.commit()

        print(f"Seeded {len(users)} users")
        # Seed Buses
        print("Seeding Owners and Buses...")
        owners = [create_owner() for _ in range(5)]
        db.session.add_all(owners)
        db.session.commit()
        buses = []
        for owner in owners:
            buses.append(create_bus(owner.id))

        db.session.add_all(buses)
        db.session.commit()
        
        # Seed Routes And Locations
        print("Seeding Routes...")
        routes = [create_route() for _ in range(20)]  # 5 routes
        db.session.add_all(routes)
        db.session.commit()


        # Seed Locations
        print("Seeding Locations...")
        locations = []
        for idx, route in enumerate(routes):
            if idx < len(dummy_data):
                for loc in dummy_data[idx]:
                    locations.append(create_location(
                        route_id=route.id,
                        longitude=loc["lng"],
                        latitude=loc["lat"],
                        name=loc["name"]
                    ))
        db.session.bulk_save_objects(locations)
        db.session.commit()

        # Seed Trips
        print("Seeding Trips...")
        trips = []
        for _ in range(20):
            driver = rc(drivers)
            bus = rc(buses)
            route = rc(routes)

            trip = create_trip(driver.id, bus.id, route.id)
            db.session.add(trip)
            trips.append(trip)
        db.session.commit()
        # Seed Bookings
        print("Seeding Bookings...")
        bookings = []
        for _ in range(20):
            parent = rc(parents)
            trip = rc(trips)
            booking = create_booking(parent.id,trip.id)
            bookings.append(booking)
            db.session.add(booking)
            
        db.session.commit()
        print("Seeding complete!")