from api.db.mariadb import Connector, MariaDB
from api import app
import re

"""
Model Class for a user which represents a table row
and a save function through which the user can be inserted or updated   
"""


class User:

    __db = Connector.connect()
    __insertSql = """INSERT INTO users
                   (username, email, password, name, surname) 
                   VALUES (%(username)s, %(email)s, %(password)s, %(name)s, %(surname)s)"""
    __updateSql = """UPDATE users 
                     SET username = %(username)s, email = %(email)s, password = %(password)s, name = %(name)s,
                     surname = %(surname)s, description = %(description)s, profilpicture = %(profilpicture)s 
                     WHERE id = %(id)s"""
    __selectSql = "SELECT * FROM users WHERE id = %(id)s"
    __deleteSql = "DELETE FROM users WHERE id = %(id)s"

    # gets a dict with the needed userData an constructs a user instance
    def __init__(self, userData):
        self.id = userData.get("id")
        self.username = userData.get("username")
        self.email = userData.get("email")
        self.password = userData.get("password")
        self.name = userData.get("name")
        self.surname = userData.get("surname")
        self.description = userData.get("description")
        self.profilpicture = userData.get("profilpicture")
        self.created_at = userData.get("created_at")
        self.trips = []

    # this method fetches a user out of the database
    # param: id of user
    # returns user instance
    @staticmethod
    def get(id):
        try:
            cursor = User.__db.cursor(dictionary=True)
            cursor.execute(User.__selectSql, {'id': id})
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
    def getDict(self):
        userData = self.__dict__
        userData.pop("trips")
        return userData

    # the save functions saves the user instance into the database
    # if the user already exists it gets updated otherwise inserted
    def save(self):
        if self.id is None:
            return self.insert()
        else:
            return self.update()

    # inserts the user instance
    # returns user.id
    def insert(self):
        try:
            cursor = User.__db.cursor()
            cursor.execute(User.__insertSql, self.getDict())
            User.__db.commit()
            self.id = cursor.lastrowid
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # updates the user instance
    # returns user.id
    def update(self):
        try:
            cursor = User.__db.cursor()
            cursor.execute(User.__updateSql, self.getDict())
            User.__db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # deletes the user in the DB
    # returns deleted user.id
    def delete(self):
        try:
            cursor = User.__db.cursor()
            cursor.execute(User.__deleteSql, {'id': self.id})
            User.__db.commit()
            return self.id
        except MariaDB.Error as err:
            raise err
        finally:
            cursor.close()

    # when the user registers the userData needs to be validated
    @staticmethod
    def validateUserInput(userData):
        emailRegex = "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        if len(userData.get("username")) < 3 or len(userData.get("username")) > 20:
            return False
        if re.search(emailRegex, userData.get("email")) is None:
            return False
        if len(userData.get("password")) < 6:
            return False
        if len(userData.get("name")) < 2 or len(userData.get("name")) > 50:
            return False
        if len(userData.get("surname")) < 2 or len(userData.get("surname")) > 50:
            return False
        return True
