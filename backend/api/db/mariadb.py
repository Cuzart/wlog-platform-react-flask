import mysql.connector as MariaDB
from api import app

'''
Class to connect to the MariaDB
It saves the connection so that the connection 
does not have to be established for each query 
'''


class Connector:
    __dbConnection = None

    @staticmethod
    def connect():
        if Connector.__dbConnection is None:
            Connector.__dbConnection = MariaDB.connect(
                host="mariadb",
                user="admin",
                passwd="wlog2020",
                database="wlog"
            )
            # app.logger.info("creating new DB Connection")
            return Connector.__dbConnection
        else:
            # app.logger.info("get pending DB Connection")
            return Connector.__dbConnection
