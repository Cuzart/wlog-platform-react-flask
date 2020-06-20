from api.db.mariadb import Connector, MariaDB
from api.db.model import Model
import json
from api import app


class Post(Model):
    """
    Model Class for a post which represents a table row
    has functions to manipulate and interact with the database  
    """

    __INSERT_SQL = """INSERT INTO posts
                   (trip_id, subtitle, location_label, location_longitude, location_latitude, text) 
                   VALUES (%(trip_id)s, %(subtitle)s, %(location_label)s, %(location_longitude)s, %(location_latitude)s, %(text)s)"""
    __UPDATE_SQL = """UPDATE posts 
                     SET subtitle = %(subtitle)s, location_label = %(location_label)s, 
                         location_longitude = %(location_longitude)s, location_latitude = %(location_latitude)s, text = %(text)s
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM posts WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM posts WHERE id = %(id)s"
    __SELECT_ALL_TRIP_POSTS_SQL = "SELECT * FROM posts WHERE trip_id = %(trip_id)s"

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
        return self._text

    @text.setter
    def text(self, text):
        self._text = text

    ####################
    ##   FUNCTIONS    ##
    ####################
    @staticmethod
    def get(id):
        """this method fetches a post instance out of the database

        Args:
            id (int): id of the prefered post instance

        Returns:
            Post: post instance or None
        """
        try:
            cursor = Model._db.cursor(dictionary=True)
            cursor.execute(Post.__SELECT_SQL, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None
            post = post(result)
            return post
        except MariaDB.Error as err:
            app.logger.info("Something went wrong: {}".format(err))
            raise err
        except Exception as err:
            app.logger.info("An error occured: {}".format(err))
            raise err
        finally:
            cursor.close()

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
            cursor = Model._db.cursor()
            cursor.execute(Post.__INSERT_SQL, self.get_dict())
            Model._db.commit()
            self._id = cursor.lastrowid
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    def update(self):
        """method to update an instance in the DB

        Returns:
            int: id of post instance
        """
        try:
            cursor = Model._db.cursor()
            cursor.execute(Post.__UPDATE_SQL, self.get_dict())
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    def delete(self):
        """method to delete an instance in the DB

        Returns:
            int: id of deleted post instance
        """
        try:
            cursor = Model._db.cursor()
            cursor.execute(Post.__DELETE_SQL, {'id': self.id})
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    @staticmethod
    def get_all_trip_posts(trip_id):
        """provides all posts belonging to a trip

        Args:
            trip_id (int): id of trip

        Returns:
            list: list of post instances
        """
        try:
            cursor = Model._db.cursor(dictionary=True)
            cursor.execute(Post.__SELECT_ALL_TRIP_POSTS_SQL,
                           {'trip_id': trip_id})
            result = cursor.fetchall()
            if result is None:
                return []
            else:
                posts = []
                for post_data in result:
                    posts.append(Post(post_data))
                return posts
        except MariaDB.Error as err:
            app.logger.info("Something went wrong: {}".format(err))
            raise err
        except Exception as err:
            app.logger.info("An error occured: {}".format(err))
            raise err
        finally:
            cursor.close()
