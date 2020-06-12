from api.db.mariadb import Connector, MariaDB
from api.db.model import Model
from api import app


class Trip(Model):
    """trips..."""

    __INSERT_SQL = """INSERT INTO trips
                   (user_id, title, country, description, thumbnail) 
                   VALUES (%(user_id)s, %(title)s, %(country)s %(description)s, %(thumbnail)s"""
    __UPDATE_SQL = """UPDATE users 
                     SET title = %(title)s, country = %(country)s, description = %(thumbnail)s
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM trips WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM trips WHERE id = %(id)s"
    __SELECT_ALL_USER_TRIPS_SQL = "SELECT * FROM trips WHERE user_id = %(user_id)s"

    # gets a dict with the needed tripData an constructs a trip instance
    def __init__(self, trip_data):
        super().__init__(trip_data.get("id"), trip_data.get("created_at"))
        self._user_id = trip_data.get("user_id")
        self.title = trip_data.get("title")
        self.country = trip_data.get("country")
        self.description = trip_data.get("description")
        self.thumbnail = trip_data.get("thumbnail")
        self.posts = []

    ## PROPERTIES ##

    @property
    def user_id(self):
        return self._userId

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, title):
        self._title = title

    @property
    def country(self):
        return self._country

    @country.setter
    def country(self, country):
        self._country = country

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, description):
        self._description = description

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
            cursor.execute(Trip.__SELECT_SQL, {'id': id})
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
            # return None
        finally:
            cursor.close()

    # returns a dict with all trip attributes
    def get_dict(self):
        trip_data = {}
        for property, value in self.__dict__.items():
            trip_data[property.lstrip("_")] = value

        trip_data.pop("posts")
        return trip_data

    # inserts the user instance
    # returns user.id
    def insert(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(Trip.__INSERT_SQL, self.get_dict())
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
            cursor.execute(Trip.__UPDATE_SQL, self.get_dict())
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
            cursor.execute(Trip.__DELETE_SQL, {'id': self.id})
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    @staticmethod
    def create_trip(trip_data):
        trip = Trip(trip_data)
        trip.save()
        return trip

    @staticmethod
    def get_all_user_trips(user_id):
        try:
            cursor = Model._db.cursor(dictionary=True)
            cursor.execute(Trip.__SELECT_ALL_USER_TRIPS_SQL,
                           {'user_id': user_id})
            result = cursor.fetchall()
            if result is None:
                return []
            else:
                trips = []
                for trip_data in result:
                    trips.append(Trip(trip_data))
                return trips
        except MariaDB.Error as err:
            app.logger.info("Something went wrong: {}".format(err))
            raise err
        except Exception as err:
            app.logger.info("An error occured: {}".format(err))
            raise err
            # return None
        finally:
            cursor.close()
