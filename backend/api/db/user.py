import mysql.connector
from flask import current_app
from api.db.model import Model
from api.db.trip import Trip
import re
from passlib.hash import sha256_crypt
from api.config import config
from api import conn_pool


class User(Model):
    """
    Model Class for a user which represents a table row
    has functions to manipulate and interact with the database  
    """

    __INSERT_SQL = """INSERT INTO users
                   (username, email, password, name, surname) 
                   VALUES (%(username)s, %(email)s, %(password)s, %(name)s, %(surname)s)"""
    __UPDATE_SQL = """UPDATE users 
                     SET username = %(username)s, email = %(email)s, password = %(password)s, name = %(name)s,
                     surname = %(surname)s, description = %(description)s, profilepicture = %(profilepicture)s 
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM users WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM users WHERE id = %(id)s"
    __USERNAME_AVAILABLE_SQL = "SELECT * FROM users WHERE username = %(username)s"
    __CHECK_LOGIN_SQL = "SELECT id, username, password FROM users WHERE username = %(username)s"

    def __init__(self, user_data):
        """Constructor of user instance

        Args:
            user_data (dict): includes all properties of user instance
        """
        super().__init__(user_data.get("id"), user_data.get("created_at"))
        self.username = user_data.get("username")
        self.email = user_data.get("email")
        self.password = user_data.get("password")
        self.name = user_data.get("name")
        self.surname = user_data.get("surname")
        self.description = user_data.get("description")
        self.profilepicture = user_data.get("profilepicture")
        self.trips = []

    ####################
    ##   PROPERTIES   ##
    ####################
    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        self._username = username

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, email):
        self._email = email

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = sha256_crypt.encrypt(str(password))

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, name):
        self._name = name

    @property
    def surname(self):
        return self._surname

    @surname.setter
    def surname(self, surname):
        self._surname = surname

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, description):
        self._description = description

    @property
    def profilepicture(self):
        return self._profilepicture

    @profilepicture.setter
    def profilepicture(self, profilepicture):
        self._profilepicture = profilepicture

    @property
    def trips(self):
        return self._trips

    @trips.setter
    def trips(self, trips):
        self._trips = trips

    ####################
    ##   FUNCTIONS    ##
    ####################
    def get_dict(self):
        """gets a dict with all user properties

        Returns:
            [dict]: with user properties
        """
        user_data = {}
        for property, value in self.__dict__.items():
            user_data[property.lstrip("_")] = value
        return user_data

    def load_trips(self):
        """loads all trips of the user out of the database
        """
        self.trips = Trip.get_all_user_trips(self.id)

    def insert(self):
        """method to insert an instance into the DB.
        Node that 'is_username_available()' should be executed beforehand 

        Returns:
            int: id of user instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            user_data = self.get_dict()
            user_data.pop("trips")
            cursor.execute(User.__INSERT_SQL, user_data)
            cnx.commit()
            self._id = cursor.lastrowid
            current_app.logger.info("Added a new user with id: {}".format(self.id))
            return self.id
        except mysql.connector.IntegrityError as err:
            current_app.logger.warning(
                "Integrity error while inserting a user: %s" % err)
            return None
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    def update(self):
        """method to update an instance in the DB

        Returns:
            int: id of user instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            user_data = self.get_dict()
            user_data.pop("trips")
            cursor.execute(User.__UPDATE_SQL, user_data)
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
            int: id of deleted user instance
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(User.__DELETE_SQL, {'id': self.id})
            cnx.commit()
            current_app.logger.info("User with id {} deleted".format(self.id))
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
        """this method fetches a user instance out of the database

        Args:
            id (int): id of the prefered user instance

        Returns:
            User: user instance or None
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(User.__SELECT_SQL, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None
            user = User(result)
            return user
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return None
        finally:
            cnx.close()

    @staticmethod
    def validate_user_input(user_data):
        """validates the user_data for registry

        Args:
            user_data (dict): should include all properties of a user instance

        Returns:
            list: list of errors found
        """
        email_regex = "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        username_regex = "([a-zA-Z0-9_\-\.]+)"
        error = []
        if len(user_data.get("username")) < 3 or len(user_data.get("username")) > 20 \
                or re.search(username_regex, user_data.get("username")) is None:
            error.append("Invalid username")
        if not User.is_username_available(user_data.get("username")):
            error.append("Username not available")
        if re.search(email_regex, user_data.get("email")) is None:
            error.append("Invalid email")
        if len(user_data.get("password")) < 6:
            error.append("Password to short")
        if len(user_data.get("name")) < 2 or len(user_data.get("name")) > 50:
            error.append("Invalid name")
        if len(user_data.get("surname")) < 2 or len(user_data.get("surname")) > 50:
            error.append("Invalid surname")
        return error

    @staticmethod
    def is_username_available(username):
        """checks if whished username is available

        Args:
            username (string): prefered username

        Returns:
            bool: True or False 
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor()
            cursor.execute(User.__USERNAME_AVAILABLE_SQL,
                           {'username': username})
            data = cursor.fetchall()
            if len(data) > 0:
                return False
            return True
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return False
        finally:
            cnx.close()

    @staticmethod
    def check_login(username, password_candidate):
        """checks if user and password match

        Args:
            username (string): username to check
            password_candidate (string): provided password

        Returns:
            bool: True or False
        """
        try:
            cnx = conn_pool.get_connection()
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(User.__CHECK_LOGIN_SQL, {'username': username})
            result = cursor.fetchone()
            if result is None:
                return False
            password = result["password"]
            if sha256_crypt.verify(password_candidate, password):
                return result["id"]
            else:
                return False
        except mysql.connector.Error as err:
            current_app.logger.error("An error occured: {}".format(err))
            return False
        finally:
            cnx.close()

    @staticmethod
    def get_profile_data(id):
        """provides profile data for sending to clients

        Args:
            id (int): id of user instance

        Returns:
            dict: dict with all public properties of user 
        """
        user = User.get(id)
        if user is None:
            return dict()
        user.load_trips()
        # convert trips to Dict
        trips_dict = []
        for trip in user.trips:
            trips_dict.append(trip.get_dict())
        profile_data = user.get_dict()
        profile_data["trips"] = trips_dict
        # remove personal data
        profile_data.pop("email")
        profile_data.pop("password")
        profile_data.pop("created_at")
        return profile_data

    @staticmethod
    def edit_profile(id, new_data):
        user = User.get(id)
        user.name = new_data["name"]
        user.surname = new_data["surname"]
        user.description = new_data["description"]
        if user.save() is None:
            return False
        return True
