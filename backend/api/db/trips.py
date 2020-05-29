from api.db.mariadb import Connector, MariaDB
from api import app

class trips:
    __db = Connector.connect()
    __insertSql = ""
    __updateSql = ""
    __selectSql = ""
    __deleteSql = ""

    def __init__(self):
        pass

#TODO