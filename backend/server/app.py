#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from controllers.drivers import Drivers, DriverById, DriverTrips, DriverTripById, DriverAuth
from controllers.auth import Auth
from controllers.users import Users, UserById, CurrentUser
from controllers.analytics import Analytics
from controllers.routes import Routes, RouteById, TopRoutes, LocationById, Locations
from controllers.buses import BusById, Buses
from controllers.bookings import Bookings, BookingById
from controllers.contacts import Contacts, ContactById
from controllers.owners import Owners, OwnerById
from controllers.fcm import SaveFcmToken, SendNotification
from controllers.payments import payments_bp # Importing the payments blueprint
# Local imports
from config import app, db, api, socketio
import utilities.socket

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Auth, '/api/auth')
api.add_resource(Users, '/api/users/<string:role>')
api.add_resource(UserById, '/api/users/<int:id>')
api.add_resource(CurrentUser, '/api/users/me')
#  Drivers endpoint
api.add_resource(Drivers, '/api/drivers')
api.add_resource(DriverById, '/api/drivers/<int:id>')
api.add_resource(DriverAuth, '/api/drivers/<string:name>')
api.add_resource(DriverTrips, '/api/drivers/<int:id>/trips')
api.add_resource(DriverTripById, '/api/drivers/<int:id>/trip/<int:trip_id>')

api.add_resource(Owners, '/api/owners')
api.add_resource(OwnerById, '/api/owners/<int:id>')
api.add_resource(Bookings, '/api/bookings')
api.add_resource(BookingById, '/api/bookings/<int:id>')
api.add_resource(Routes, '/api/routes')
api.add_resource(RouteById, '/api/routes/<int:id>')
api.add_resource(TopRoutes, '/api/routes/top')
api.add_resource(Locations, '/api/locations')
api.add_resource(LocationById, '/api/locations/<int:id>')
api.add_resource(Buses, '/api/buses')
api.add_resource(BusById, '/api/buses/<int:id>')
#  Analytics endpoint
api.add_resource(Analytics, '/api/analytics')
# Contact endpoints
api.add_resource(Contacts, '/api/contacts')
api.add_resource(ContactById, '/api/contacts/<int:id>') 
# Fcm endpoints
api.add_resource(SaveFcmToken, '/api/save-fcm-token')
api.add_resource(SendNotification, '/api/send-notification')

if __name__ == '__main__':
    import eventlet
    import eventlet.wsgi
    socketio.run(app, port=5000, debug=True)
