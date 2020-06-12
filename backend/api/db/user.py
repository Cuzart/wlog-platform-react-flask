from api.db.mariadb import MariaDB
from api import app
from api.db.model import Model
import re
from passlib.hash import sha256_crypt


class User(Model):
    """
    Model Class for a user which represents a table row
    has functions through which the user can be inserted, updated, selected and deleted   
    """

    __INSERT_SQL = """INSERT INTO users
                   (username, email, password, name, surname) 
                   VALUES (%(username)s, %(email)s, %(password)s, %(name)s, %(surname)s)"""
    __UPDATE_SQL = """UPDATE users 
                     SET username = %(username)s, email = %(email)s, password = %(password)s, name = %(name)s,
                     surname = %(surname)s, description = %(description)s, profilpicture = %(profilpicture)s 
                     WHERE id = %(id)s"""
    __SELECT_SQL = "SELECT * FROM users WHERE id = %(id)s"
    __DELETE_SQL = "DELETE FROM users WHERE id = %(id)s"
    __USERNAME_AVAILABLE_SQL = "SELECT * FROM users WHERE username = %(username)s"

    # gets a dict with the needed userData an constructs a user instance
    def __init__(self, user_data):
        super().__init__(user_data.get("id"), user_data.get("created_at"))
        self.username = user_data.get("username")
        self.email = user_data.get("email")
        self.password = user_data.get("password")
        self.name = user_data.get("name")
        self.surname = user_data.get("surname")
        self.description = user_data.get("description")
        self.profilpicture = user_data.get("profilpicture")
        self.trips = []

    ## PROPERTIES ##

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
    def profilpicture(self):
        return self._profilpicture

    @profilpicture.setter
    def profilpicture(self, profilpicture):
        self._profilpicture = profilpicture

    # this method fetches a user out of the database
    # param: id of user
    # returns user instance
    @staticmethod
    def get(id):
        try:
            cursor = Model._db.cursor(dictionary=True)
            cursor.execute(User.__SELECT_SQL, {'id': id})
            result = cursor.fetchone()
            if result is None:
                return None
            user = User(result)
            return user
        except MariaDB.Error as err:
            app.logger.info("Something went wrong: {}".format(err))
            raise err
        except Exception as err:
            app.logger.info("An error occured: {}".format(err))
            raise err
            return None
        finally:
            cursor.close()

    # returns a dict with all user attributes
    def get_dict(self):
        user_data = {}
        for property, value in self.__dict__.items():
            user_data[property.replace("_", "")] = value

        user_data.pop("trips")
        return user_data

    # inserts the user instance
    # returns user.id
    def insert(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(User.__INSERT_SQL, self.get_dict())
            Model._db.commit()
            self._id = cursor.lastrowid
            return self.id
        except MariaDB.IntegrityError as err:
            app.logger.info("Integrity error while inserting a user: %s" % err)
            return False
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # updates the user instance
    # returns user.id
    def update(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(User.__UPDATE_SQL, self.get_dict())
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # deletes the user in the DB
    # returns deleted user.id
    def delete(self):
        try:
            cursor = Model._db.cursor()
            cursor.execute(User.__DELETE_SQL, {'id': self.id})
            Model._db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # when the user registers the userData needs to be validated
    @staticmethod
    def validate_user_input(user_data):
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
        try:
            cursor = Model._db.cursor()
            cursor.execute(User.__USERNAME_AVAILABLE_SQL,
                           {'username': username})
            data = cursor.fetchall()
            if len(data) > 0:
                return False
            return True

        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()
