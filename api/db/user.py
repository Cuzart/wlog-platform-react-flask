from .mariadb import Connector

"""eine user klasse"""


class User:

    __db = Connector.connect()
    cursor = __db.cursor(prepared=True)
    insertSql = """INSERT INTO users
                    (username, email, password, name, surname, description, profilpicture) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    selectSql = "SELECT * FROM users WHERE id = %s"

    def __init__(self, username, email, password, name, surname):
        self.id = None
        self.username = username
        self.email = email
        self.password = password
        self.name = name
        self.surname = surname
        self.description = None
        self.profilpicture = None
        self.createdAt = None

    def save(self):
        if self.id is None:
            return self.insert()
        else:
            return self.update()

    def insert(self):
        val = (self.username, self.email, self.password, self.name,
               self.surname, self.description, self.profilpicture)

        User.cursor.execute(User.insertSql, val)
        User.__db.commit()
        self.id = User.cursor.lastrowid
        return self.id

    @staticmethod
    def get(id):
        cursor = User.__db.cursor(dictionary=True)
        val = (id,)
        cursor.execute(User.selectSql, val)
        result = cursor.fetchall()
        cursor.close()
        return result
