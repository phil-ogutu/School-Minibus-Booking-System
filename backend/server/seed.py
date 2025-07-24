#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from config import bcrypt

# Local imports
from config import app
from models import db, User, UserRole, Booking, Bus, Location, Driver, Owner, Route, RouteStatus, TripStatus

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

dummy_routes = [
    {"start": "JKUAT Entry Road", "end": "Kimbo"},
    {"start": "JKUAT Entry Road", "end": "Roysambu"},
    {"start": "Thika Main Stage", "end": "Nairobi CBD"},
    {"start": "Kencom", "end": "Uthiru"},
]

if __name__ == '__main__':
    fake = Faker()

    # Helper function to generate random users
    def create_user():
        return User(
            username=fake.user_name(),
            email=fake.email(),
            mobile=fake.phone_number(),
            password_hash=bcrypt.generate_password_hash(fake.password()).decode('utf-8'),  # Generating a fake password hash (for example purposes)
            photo_url=fake.image_url(),
            role=rc([UserRole.parent, UserRole.admin]),
            created_at=fake.date_this_year()  # Random date within this year
        )
    
    # Helper function to generate random buses
    def create_bus(route_id, driver_id, owner_id):
        return Bus(
            route_id=route_id,
            driver_id=driver_id,
            owner_id=owner_id,
            plate=fake.license_plate(),
            capacity=str(randint(10, 50)),  # Random capacity between 10 and 50
            status=rc([TripStatus.pending, TripStatus.started, TripStatus.ended]), # Random bus status
            created_at=fake.date_this_year(),
            arrived=fake.date_this_year(),
            departure=fake.date_this_year()
        )

    # Helper function to generate random bookings
    def create_booking(parent_id, bus_id):
        return Booking(
            parent_id=parent_id,
            bus_id=bus_id,
            title=fake.bs(),
            child_name=fake.name(),
            pickup=fake.city(),
            dropoff=fake.city(),
            price=round(randint(1000, 5000) / 100, 2),  # Random price between 10.00 and 50.00
            status=rc([True, False]),
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

    # Helper function to generate random drivers
    def create_driver():
        return Driver(
            driver_name=fake.name()
        )

    # Helper function to generate random owners
    def create_owner():
        return Owner(
            owner_name=fake.company()
        )

    # Helper function to generate random routes
    def create_route(start, end):
        return Route(
            start=start,
            end=end,
            status=rc([RouteStatus.pending, RouteStatus.started, RouteStatus.ended]),
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
        for _ in range(10):  # Let's create 10 users
            users.append(create_user())
        # db.session.bulk_save_objects(users)  # Efficient insert
        db.session.add_all(users)
        db.session.commit()

        print(f"Seeded {len(users)} users")

        # Seed Drivers and Owners
        print("Seeding Drivers and Owners...")
        drivers = [create_driver() for _ in range(5)]  # 5 drivers
        owners = [create_owner() for _ in range(5)]  # 5 owners
        db.session.add_all(drivers + owners)  # Using add_all to keep identity
        db.session.commit() # Ensures driver.id and owner.id are populate

        # Seed Routes
        print("Seeding Routes...")
        routes = []
        for r in dummy_routes:
            routes.append(create_route(r["start"], r["end"]))
        db.session.add_all(routes)
        db.session.commit()

        # Seed Buses
        print("Seeding Buses...")
        buses = []
        for route in routes:
            # Randomly choose a driver and owner for each bus
            driver = rc(drivers)
            owner = rc(owners)
            buses.append(create_bus(route.id, driver.id, owner.id))
        db.session.add_all(buses)
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

        # Seed Bookings
        print("Seeding Bookings...")
        bookings = []
        for user in users:
            # Randomly choose a bus for the booking
            bus = rc(buses)
            bookings.append(create_booking(user.id, bus.id))
        db.session.bulk_save_objects(bookings)
        db.session.commit()

        print("Seeding complete!")