#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from config import bcrypt

# Local imports
from config import app
from models import db, User, UserRole, Booking, Bus, Location, Driver, Owner, Route, RouteStatus

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
            status=rc([True, False]),  # Random bus status
            created_at=fake.date_this_year()
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
    def create_location(route_id):
        return Location(
            route_id=route_id,
            location_name=fake.city(),
            # GPS=f"{float(fake.latitude()):.6f},{float(fake.longitude()):.6f}"  # Convert to string safely  # Random GPS coordinates
            longitude=f"{float(fake.longitude()):.6f}",  # Convert to string safely  # Random GPS coordinates
            latitude=f"{float(fake.latitude()):.6f}"  # Convert to string safely  # Random GPS coordinates
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
    def create_route():
        return Route(
            start=fake.city(),
            end=fake.city(),
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
        routes = [create_route() for _ in range(5)]  # 5 routes
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
        for route in routes:
            locations.append(create_location(route.id))
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
