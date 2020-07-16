from flask import current_app
from api.db.model import Model
from api.helper.instanceCache import InstanceCache
from api.db.post import Post
from api import conn_pool
import mysql.connector


class Trip(Model):
    """
    Model Class for a trip which represents a table row
    has functions to manipulate and interact with the database
    """

    __INSERT_SQL = """INSERT INTO trips
                   (user_id, title, country, description, thumbnail)
                   VALUES (%(user_id)s, %(title)s, %(country)s, %(description)s, %(thumbnail)s)"""
    __UPDATE_SQL = """UPDATE trips
                     SET title = %(title)s, country = %(country)s,
                         description = %(description)s, thumbnail = %(thumbnail)s
                     WHERE id = %(id)s"""
    __SELECT_SQL = """SELECT t.id, t.user_id, u.username as 'author', t.title,
                             t.country, t.description, t.thumbnail, t.created_at
                      FROM users u, trips t
                      WHERE t.id = %(id)s AND u.id = t.user_id"""
    __DELETE_SQL = "DELETE FROM trips WHERE id = %(id)s"
    __SELECT_ALL_USER_TRIPS_SQL = """SELECT t.id, t.user_id, u.username as 'author', t.title,
                                            t.country, t.description, t.thumbnail, t.created_at
                                     FROM users u, trips t
                                     WHERE  u.id = t.user_id AND t.user_id = %(user_id)s"""
    __SELECT_NEW_TRIPS_SQL = "SELECT * FROM `trips` ORDER BY `created_at` DESC LIMIT 20"
    __SELECT_CLAPS_SQL = "SELECT COUNT(*) as 'claps' FROM `claps` WHERE `trip_id` = %(id)s"
    __ADD_CLAP_SQL = "INSERT INTO `claps` (`trip_id`, `clapping_user`) VALUES (%(id)s, %(user_id)s)"
    __DELETE_CLAP_SQL = "DELETE FROM `claps` WHERE `trip_id` = %(id)s AND `clapping_user` = %(user_id)s"
    __USER_CLAPPED_SQL = """SELECT COUNT(*) as 'clap' FROM `claps` 
                            WHERE `trip_id` = %(id)s AND `clapping_user` = %(user_id)s"""

    def __init__(self, trip_data):
        """Constructor of trip instance

        Args:
            trip_data (dict): includes all properties of trip instance
        """
        super().__init__(trip_data.get("id"), trip_data.get("created_at"))
        self._user_id = trip_data.get("user_id")
        self._author = trip_data.get("author")
        self.title = trip_data.get("title")
        self.country = trip_data.get("country")
        self.description = trip_data.get("description")
        self.thumbnail = trip_data.get("thumbnail")

    ####################
    ##   PROPERTIES   ##
    ####################
    @property
    def user_id(self):
        return self._userId

    @property
    def author(self):
        return self._author

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

    ####################
    ##   FUNCTIONS    ##
    ####################
    def get_dict(self):
        """gets a dict with all trip properties

        Returns:
            [dict]: with trip properties
        """
        trip_data = {}
        for property, value in self.__dict__.items():
            trip_data[property.lstrip("_")] = value
        return trip_data

    def insert(self):
        """method to insert an instance into the DB

        Returns:
            int: id of trip instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Trip.__INSERT_SQL, self.get_dict())
            cnx.commit()
            self._id = cursor.lastrowid
            current_app.logger.debug("Added a new trip with id: {}".format(self.id))
            return self.id
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    def update(self):
        """method to update an instance in the DB

        Returns:
            int: id of trip instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Trip.__UPDATE_SQL, self.get_dict())
            cnx.commit()
            return self.id
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    def delete(self):
        """method to delete an instance in the DB

        Returns:
            int: id of deleted trip instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Trip.__DELETE_SQL, {'id': self.id})
            cnx.commit()
            InstanceCache.remove('Trip', self.id)
            current_app.logger.debug("Trip {} deleted".format(self.id))
            return self.id
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    def add_post(self, post_data):
        """add a new post to the trip

        Args:
            post_data (dict): dict with all needed properties for a post

        Returns:
            bool: True if successfully saved else False
        """
        post_data["trip_id"] = self.id
        post = Post(post_data)
        if post.save() is None:
            return False
        return True

    def add_clap(self, user_id):
        """adds a new clap to the trip from a specific user

        Args:
            user_id (int): id of clapper

        Returns:
            bool: True if successfully clapped else False
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Trip.__ADD_CLAP_SQL, {'id': self.id, 'user_id': user_id})
            cnx.commit()
            return True
        except mysql.connector.IntegrityError:
            # already clapped
            return False
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return False
        finally:
            cnx.close()

    def delete_clap(self, user_id):
        """removes a the clap from a user

        Args:
            user_id (int): id of clapper

        Returns:
            bool: True or False
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Trip.__DELETE_CLAP_SQL, {'id': self.id, 'user_id': user_id})
            cnx.commit()
            return True
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return False
        finally:
            cnx.close()

    ###########################
    ##   STATIC FUNCTIONS    ##
    ###########################
    @staticmethod
    def get(id):
        """this method fetches a trip instance out of the DB or InstanceCache

        Args:
            id (int): id of the prefered trip instance

        Returns:
            Trip: trip instance or None
        """
        if InstanceCache.is_cached('Trip', id):
            return InstanceCache.get('Trip', id)

        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True, buffered=True)
            cursor.execute(Trip.__SELECT_SQL, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None
            trip = Trip(result)
            InstanceCache.add('Trip', id, trip)
            return trip
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    @staticmethod
    def get_all_user_trips(user_id):
        """provides all trip data belonging to a user

        Args:
            user_id (int): id of user

        Returns:
            list: of dicts with all trip properties
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(Trip.__SELECT_ALL_USER_TRIPS_SQL,
                           {'user_id': user_id})
            trips = cursor.fetchall()
            if trips is None:
                return []
            else:
                return trips
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return []
        finally:
            cnx.close()

    @staticmethod
    def get_trip_data(id):
        """provides a trip with corresponding posts for sending to clients

        Args:
            id (int): id of trip instance

        Returns:
            dict: dict with all properties of the trip
        """
        trip = Trip.get(id)
        if trip is None:
            return dict()

        trip_data = trip.get_dict()
        trip_data["posts"] = Post.get_all_trip_posts(id)
        return trip_data

    @staticmethod
    def get_new_trips():
        """gets a list with the 20 newest trips

        Returns:
            list: with trips and their properties
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(Trip.__SELECT_NEW_TRIPS_SQL)
            trips = cursor.fetchall()
            if trips is None:
                return []
            else:
                return trips
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return []
        finally:
            cnx.close()

    @staticmethod
    def get_claps(id):
        """gets all claps from a trip

        Args:
            id (int): id of trip instance

        Returns:
            int: clap count
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True, buffered=True)
            cursor.execute(Trip.__SELECT_CLAPS_SQL, {'id': id})
            result = cursor.fetchone()
            return result['claps']
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    @staticmethod
    def has_user_clapped(id, user_id):
        """checks whether the user has already clapped the trip

        Args:
            id (int): id of trip
            user_id (int): id of user

        Returns:
            bool: True if already clapped, else False
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True, buffered=True)
            cursor.execute(Trip.__USER_CLAPPED_SQL, {'id': id, 'user_id': user_id})
            result = cursor.fetchone()
            return bool(result['clap'])
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return False
        finally:
            cnx.close()
