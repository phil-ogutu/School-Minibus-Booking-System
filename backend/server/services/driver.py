from models import  Driver, User
from sqlalchemy.orm import joinedload

class DriverService():
    @staticmethod
    def findAll(name=''):
        query = Driver.query.options(joinedload(Driver.user))
        
        if name:
            query = query.join(User).filter(User.username.ilike(f"%{name}%"))
        
        return [driver.to_dict(rules=('-user.password',)) for driver in query.all()]
    
    @staticmethod
    def findById(id):
        if not id == None:
            return Driver.query.filter_by(id=id).first()
        return None
    
    @staticmethod
    def findOne(id=None, lic=None):
        if id is not None:
            return Driver.query.filter_by(id=id).first()
        return None
    
    @staticmethod
    def createDriver(user_id):
        return Driver(
            user_id=user_id
        )
    
    @staticmethod
    def deleteDriver(user_id):
        return Driver(
            user_id=user_id
        )

    @staticmethod
    def deleteAllDrivers():
        return 
    