from api.db.user import User
from api.helper.instanceCache import InstanceCache

USER_DATA = {
    "username": "test_user",
    "email": "test@mail.com",
    "password": "passwd",
    "name": "Max",
    "surname": "Mustermann",
}


class A:
    def __init__(self, x):
        self.x = x


class B:
    def __init__(self, x):
        self.x = x


class TestInstanceCache():
    """Class to test the instance cache.
    Is using the app_context fixture defined in 'conftest.py'
    """

    def test_add_get_remove(self, app_context):
        a = A(1)
        InstanceCache.add('A', 1, a)
        b = InstanceCache.get('A', 1)
        assert a is b
        InstanceCache.remove('A', 1)
        c = InstanceCache.get('A', 1)
        assert c is None

    def test_is_cached(self, app_context):
        b = B(2)
        assert not InstanceCache.is_cached('B', 1)
        InstanceCache.add('B', 1, b)
        assert InstanceCache.is_cached('B', 1)
        InstanceCache.remove('B', 1)
        assert not InstanceCache.is_cached('B', 1)

    def test_clear(self, app_context):
        b = B(111)
        InstanceCache.add('B', 1, b)
        InstanceCache.clear()
        assert len(InstanceCache.storage) == 0

    def test_with_user_instance(self, app_context):
        user = User(USER_DATA)
        id = user.save()
        user_from_db = User.get(id)
        user_from_cache = User.get(id)
        user_from_db.description = "Moinsen"
        assert user_from_cache.description == user_from_db.description
        assert user_from_cache is user_from_db
