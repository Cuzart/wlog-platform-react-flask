import mysql.connector

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
            Connector.__dbConnection = mysql.connector.connect(
                host="mariadb",
                user="admin",
                passwd="wlog2020",
                database="wlog"
            )
            return Connector.__dbConnection
        else:
            return Connector.__dbConnection
