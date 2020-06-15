from abc import ABC, abstractmethod
from api.db.mariadb import Connector


class Model(ABC):

    _db = Connector.connect()

    def __init__(self, id, created_at):
        self._id = id
        self._created_at = created_at

    @property
    def id(self):
        return self._id

    @property
    def created_at(self):
        return self._id

    # the save functions saves the instance into the database
    # if it already exists it gets updated otherwise inserted
    def save(self):
        if self.id is None:
            return self.insert()
        else:
            return self.update()

    @abstractmethod
    def insert(self):
        pass

    @abstractmethod
    def update(self):
        pass
