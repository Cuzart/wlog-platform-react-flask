import mysql.connector

dbConnection = None


def connect():
    global dbConnection
    if dbConnection is None:
        dbConnection = mysql.connector.connect(
            host="mariadb",
            user="admin",
            passwd="wlog2020",
            database="wlog"
        )
        return dbConnection
    else:
        return dbConnection
