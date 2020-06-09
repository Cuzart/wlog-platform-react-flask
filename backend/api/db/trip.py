from api.db.mariadb import Connector, MariaDB
from api.db.model import Model
from api import app

class Trip(Model):
    """trips..."""


    __insertSql = """INSERT INTO trips
                   (user_id, title, description, thumbnail) 
                   VALUES (%(user_id)s, %(title)s, %(description)s, %(thumbnail)s"""
    __updateSql = """UPDATE users 
                     SET title = %(title)s, description = %(thumbnail)s
                     WHERE id = %(id)s"""
    __selectSql = "SELECT * FROM trips WHERE id = %(id)s"
    __deleteSql = "DELETE FROM trips WHERE id = %(id)s"

    # gets a dict with the needed tripData an constructs a trip instance
    def __init__(self, tripData):
        super().__init__(tripData.get("id"), tripData.get("created_at"))
        self._userId = tripData.get("user_id")
        self.title = tripData.get("title")
        self.description = tripData.get("description")
        self.thumbnail = tripData.get("thumbnail")
        self.posts = []

    ## PROPERTIES ##

    @property
    def userId(self):
        return self._userId

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, title):
        self._title = title

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, description):
        self.description = description

    @property
    def thumbnail(self):
        return self._thumbnail

    @thumbnail.setter
    def thumbnail(self, thumbnail):
        self._thumbnail = thumbnail

    
    # this method fetches a trip out of the database
    # param: id of trip
    # returns trip instance

    @staticmethod
    def get(id):
        try:
            cursor = Model._db.cursor(dictionary=True)
            cursor.execute(Trip.__selectSql, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None
            trip = Trip(result)
            return trip
        except MariaDB.Error as err:
            app.logger.info("Something went wrong: {}".format(err))
            raise err
        except Exception as err:
            app.logger.info("An error occured: {}".format(err))
            raise err
            #return None
        finally:
            cursor.close()

    # returns a dict with all trip attributes
    def getDict(self):
        tripData = {}
        for property, value in self.__dict__.items():
            tripData[property.replace("_", "")] = value

        tripData.pop("posts")
        return tripData

    # the save functions saves the trip instance into the database
    # if the trip already exists it gets updated otherwise inserted
    def save(self):
        if self.id is None:
            return self.insert()
        else:
            return self.update()

    # inserts the user instance
    # returns user.id
    def insert(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(Trip.__insertSql, self.getDict())
            Model._db.commit()
            self._id = cursor.lastrowid
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # updates the trip instance
    # returns trip.id
    def update(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(Trip.__updateSql, self.getDict())
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # deletes the trip in the DB
    # returns deleted trip.id
    def delete(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(Trip.__deleteSql, {'id': self.id})
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()
