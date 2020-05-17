import mariadb


class user:

    db = mariadb.connect()
    cursor = db.cursor(prepared=True)
    insertSql = """INSERT INTO users
                    (username, email, password, name, surname, description, profilpicture) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)"""

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
        if id is None:
            return self.insert()
        else:
            return self.update()

    def insert(self):
        val = (self.username, self.email, self.password, self.name,
               self.surname, self.description, self.profilpicture)

        user.cursor.execute(user.insertSql, val)
        user.db.commit()
        self.id = user.cursor.lastrowid
        return self.id

    @staticmethod
    def get(id):
        pass
