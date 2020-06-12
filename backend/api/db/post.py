from api.db.mariadb import Connector, MariaDB
from api.db.model import Model
from api import app


class Post(Model):
    """post..."""

    __INSERT_SQL = """INSERT INTO trips
                   (trip_id, subtitle, location_longitude, location_latitude, text, gallery) 
                   VALUES (%(tripId)s, %(subtitle)s, %(location_longitude)s, %(location_latitude)s, %(text)s, %(gallery)s """
    __UPDATE_SQL = """UPDATE trips 
                     SET subtitle = %(subtitle)s, location_longitude = %(location_longitude)s, 
                         location_latitude = %(location_latitude)s, text = %(text)s, gallery = %(gallery)s 
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM trips WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM trips WHERE id = %(id)s"

    # gets a dict with the needed tripData an constructs a trip instance
    def __init__(self, post_data):
        super().__init__(post_data.get("id"), post_data.get("created_at"))
        self._trip_id = post_data.get("trip_id")
        self.subtitle = post_data.get("subtitle")
        self.location_longitude = post_data.get("location_longitude")
        self.location_latitude = post_data.get("location_latitude")
        self.text = post_data.get("text")
        self.gallery = post_data.get("gallery")

    ## PROPERTIES ##

    @property
    def trip_id(self):
        return self._userId

    @property
    def subtitle(self):
        return self._title

    @subtitle.setter
    def subtitle(self, subtitle):
        self._subtitle = subtitle

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

    @property
    def gallery(self):
        return self._gallery

    @gallery.setter
    def gallery(self, gallery):
        self._gallery = gallery

    # this method fetches a post out of the database
    # param: id of post
    # returns post instance
    @staticmethod
    def get(id):
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

    # returns a dict with all post attributes
    def get_dict(self):
        postData = {}
        for property, value in self.__dict__.items():
            postData[property.lstrip("_")] = value

        return postData

    # inserts the post instance
    # returns post.id
    def insert(self):
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

    # updates the post instance
    # returns post.id
    def update(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(Post.__UPDATE_SQL, self.get_dict())
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # deletes the post in the DB
    # returns deleted post.id
    def delete(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(Post.__DELETE_SQL, {'id': self.id})
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()
