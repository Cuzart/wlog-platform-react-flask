import mysql.connector as MariaDB
from api import app



class Connector:
    '''
    Class to connect to the MariaDB
    It saves the connection so that the connection 
    does not have to be established for each query 
    '''

    __db_connection = None

    @staticmethod
    def connect():
        if Connector.__db_connection is None:
            Connector.__db_connection = MariaDB.connect(
                host="mariadb",
                user="admin",
                passwd="wlog2020",
                database="wlog"
            )
            # app.logger.info("creating new DB Connection")
            return Connector.__db_connection
        else:
            # app.logger.info("get pending DB Connection")
            return Connector.__db_connection
