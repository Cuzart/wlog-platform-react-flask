from flask import current_app
from api.db.model import Model
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
    __UPDATE_SQL = """UPDATE users 
                     SET title = %(title)s, country = %(country)s, description = %(thumbnail)s
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM trips WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM trips WHERE id = %(id)s"
    __SELECT_ALL_USER_TRIPS_SQL = "SELECT * FROM trips WHERE user_id = %(user_id)s"

    def __init__(self, trip_data):
        """Constructor of trip instance

        Args:
            trip_data (dict): includes all properties of trip instance
        """
        super().__init__(trip_data.get("id"), trip_data.get("created_at"))
        self._user_id = trip_data.get("user_id")
        self.title = trip_data.get("title")
        self.country = trip_data.get("country")
        self.description = trip_data.get("description")
        self.thumbnail = trip_data.get("thumbnail")
        self.posts = []

    ####################
    ##   PROPERTIES   ##
    ####################
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

    @property
    def posts(self):
        return self._posts

    @posts.setter
    def posts(self, posts):
        self._posts = posts

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

    def load_posts(self):
        """loads all posts of the trip out of the database
        """
        self.posts = Post.get_all_trip_posts(self.id)

    def insert(self):
        """method to insert an instance into the DB

        Returns:
            int: id of trip instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            trip_data = self.get_dict()
            trip_data.pop("posts")
            cursor.execute(Trip.__INSERT_SQL, trip_data)
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

    ###########################
    ##   STATIC FUNCTIONS    ##
    ###########################
    @staticmethod
    def get(id):
        """this method fetches a trip instance out of the database

        Args:
            id (int): id of the prefered trip instance

        Returns:
            Trip: trip instance or None
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(Trip.__SELECT_SQL, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None
            trip = Trip(result)
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
            list: list of trip instances
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
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
        trip.load_posts()
        # convert posts to Dict
        posts_dict = []
        for post in trip.posts:
            post_dict = post.get_dict()
            post_dict["text"] = post.text
            posts_dict.append(post_dict)
        trip_data = trip.get_dict()
        trip_data["posts"] = posts_dict
        return trip_data
