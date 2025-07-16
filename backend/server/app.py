#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api

# Add your model imports
class Users(Resource):
    pass

class Bookings(Resource):
    pass

class Routes(Resource):
    pass

class Locations(Resource):
    pass

class BookingById(Resource):
    pass

class Buses(Resource):
    pass

class Drivers(Resource):
    pass

class Owners(Resource):
    pass

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
