from flask import current_app
from api.db.model import Model
from api import conn_pool
import mysql.connector
import html


class Post(Model):
    """
    Model Class for a post which represents a table row
    has functions to manipulate and interact with the database
    """

    __INSERT_SQL = """INSERT INTO posts
                   (trip_id, subtitle, location_label, location_longitude, location_latitude, text)
                   VALUES (%(trip_id)s, %(subtitle)s, %(location_label)s,
                        %(location_longitude)s, %(location_latitude)s, %(text)s)"""
    __UPDATE_SQL = """UPDATE posts
                     SET subtitle = %(subtitle)s, location_label = %(location_label)s,
                         location_longitude = %(location_longitude)s,
                         location_latitude = %(location_latitude)s, text = %(text)s
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM posts WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM posts WHERE id = %(id)s"
    __SELECT_ALL_TRIP_POSTS_SQL = "SELECT * FROM posts WHERE trip_id = %(trip_id)s"
    __SELECT_ALL_USER_POSTS_SQL = """SELECT t.title, p.trip_id, p.subtitle, p.location_label,
                                        p.location_longitude, p.location_latitude,
                                        p.text, p.created_at
                                     FROM trips t, posts p
                                     WHERE t.user_id = %(user_id)s AND p.trip_id = t.id"""
    __SELECT_NEW_POSTS_SQL = "SELECT * FROM `posts` ORDER BY `created_at` DESC LIMIT 15"

    def __init__(self, post_data):
        """Constructor of post instance

        Args:
            post_data (dict): includes all properties of post instance
        """
        super().__init__(post_data.get("id"), post_data.get("created_at"))
        self._trip_id = post_data.get("trip_id")
        self.subtitle = post_data.get("subtitle")
        self.location_label = post_data.get("location_label")
        self.location_longitude = post_data.get("location_longitude")
        self.location_latitude = post_data.get("location_latitude")
        self.text = post_data.get("text")

    ####################
    ##   PROPERTIES   ##
    ####################
    @property
    def trip_id(self):
        return self._trip_id

    @property
    def subtitle(self):
        return self._subtitle

    @subtitle.setter
    def subtitle(self, subtitle):
        self._subtitle = subtitle

    @property
    def location_label(self):
        return self._location_label

    @location_label.setter
    def location_label(self, location_label):
        self._location_label = location_label

    @property
    def location_longitude(self):
        return self._location_longitude

    @location_longitude.setter
    def location_longitude(self, location_longitude):
        self._location_longitude = location_longitude

    @property
    def location_latitude(self):
        return self._location_latitude

    @location_latitude.setter
    def location_latitude(self, location_latitude):
        self._location_latitude = location_latitude

    @property
    def text(self):
        # unsecape to display html
        return html.unescape(self._text)

    @text.setter
    def text(self, text):
        self._text = text

    ####################
    ##   FUNCTIONS    ##
    ####################
    def get_dict(self):
        """gets a dict with all post properties

        Returns:
            [dict]: with post properties
        """
        postData = {}
        for property, value in self.__dict__.items():
            postData[property.lstrip("_")] = value
        return postData

    def insert(self):
        """method to insert an instance into the DB

        Returns:
            int: id of post instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Post.__INSERT_SQL, self.get_dict())
            cnx.commit()
            self._id = cursor.lastrowid
            current_app.logger.debug(
                "Added a new post with id: {}".format(self.id))
            return self.id
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    def update(self):
        """method to update an instance in the DB

        Returns:
            int: id of post instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Post.__UPDATE_SQL, self.get_dict())
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
            int: id of deleted post instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(Post.__DELETE_SQL, {'id': self.id})
            cnx.commit()
            current_app.logger.debug("Post {} deleted".format(self.id))
            return self.id
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    ###########################
    ##   STATIC FUNCTIONS    ##
    ###########################
    @staticmethod
    def get(id):
        """this method fetches a post instance out of the database

        Args:
            id (int): id of the prefered post instance

        Returns:
            Post: post instance or None
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True, buffered=True)
            cursor.execute(Post.__SELECT_SQL, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None

            return Post(result)
        except mysql.connector.Error as err:
            current_app.logger.error("Something went wrong: {}".format(err))
            return None
        except Exception as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    @staticmethod
    def get_all_trip_posts(trip_id):
        """provides all posts belonging to a trip

        Args:
            trip_id (int): id of trip

        Returns:
            list: of dicts with all post properties
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(Post.__SELECT_ALL_TRIP_POSTS_SQL,
                           {'trip_id': trip_id})
            posts = cursor.fetchall()
            if posts is None:
                return []
            else:
                return posts
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return []
        finally:
            cnx.close()

    @staticmethod
    def get_all_user_posts(user_id):
        """provides all post data belonging to a user

        Args:
            user_id (int): id of user

        Returns:
            list: of dicts with all post properties
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(Post.__SELECT_ALL_USER_POSTS_SQL,
                           {'user_id': user_id})
            posts = cursor.fetchall()
            if posts is None:
                return []
            else:
                return posts
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return []
        finally:
            cnx.close()

    @staticmethod
    def get_new_posts():
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(Post.__SELECT_NEW_POSTS_SQL)
            posts = cursor.fetchall()
            if posts is None:
                return []
            else:
                return posts
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return []
        finally:
            cnx.close()
