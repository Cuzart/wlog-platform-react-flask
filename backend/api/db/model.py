from abc import ABC, abstractmethod


class Model(ABC):
    """
    defines a basic abstract Model Class, with to properties.
    An id and a created_at which each Model needs to implement
    Other Model Classes should inherit from this 
    """

    def __init__(self, id, created_at):
        self._id = id
        self._created_at = created_at

    @property
    def id(self):
        return self._id

    @property
    def created_at(self):
        return self._id

    def save(self):
        """
        the save functions saves the instance into the database 
        if it already exists it gets updated otherwise inserted

        Returns:
            int: the id of the saved instance
        """

        if self.id is None:
            return self.insert()
        else:
            return self.update()

    @abstractmethod
    def insert(self):
        """method to insert an instance into the DB"""
        pass

    @abstractmethod
    def update(self):
        """method to update an instance in the DB"""
        pass

    @abstractmethod
    def delete(self):
        """method to delete an instance in the DB"""
        pass
