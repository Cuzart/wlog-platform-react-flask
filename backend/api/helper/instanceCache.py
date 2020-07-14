from collections import defaultdict


class InstanceCache:
    """Class to cache db model instances.
    has 2 big advantages. Instance does not need to be fetched from DB each time.
    In rare cases if 2 or even more requests want to change the instance and save it to db,
    they don't overwrite each other
    """

    storage = defaultdict(dict)

    @staticmethod
    def add(class_type, id, instance):
        """add instance to cache

        Args:
            class_type (string): to which class the instance belongs
            id (int): id of model instance
            instance : the instance self
        """
        InstanceCache.storage[class_type][id] = instance

    @staticmethod
    def remove(class_type, id):
        """removes the stored instance

        Args:
            class_type (string): class of instance
            id (int): id of instance to remove
        """
        del InstanceCache.storage[class_type][id]

    @staticmethod
    def get(class_type, id):
        """get reference of stored instance

        Args:
            class_type (string): class of instance
            id (int): id of instance

        Returns:
            instance: reference to instance
        """
        return InstanceCache.storage[class_type].get(id)

    @staticmethod
    def is_cached(class_type, id):
        """checks if instance is already in cache

        Args:
            class_type (string): class of instance
            id (int): id of instance

        Returns:
            bool: True or False
        """
        if InstanceCache.storage[class_type].get(id) is None:
            return False
        else:
            return True

    @staticmethod
    def clear():
        for _ in range(len(InstanceCache.storage)):
            InstanceCache.storage.popitem()
