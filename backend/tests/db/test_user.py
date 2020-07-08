import pytest
from api.db.user import User


TEST_USER_DATA = {
    "username": "test_user",
    "email": "test@mail.com",
    "password": "passwd",
    "name": "Max",
    "surname": "Mustermann",
}


def test_get_with_empty_db(client):
    user = User.get(1)
    assert user is None


def test_user_instance():
    user = User(TEST_USER_DATA)
    assert user.id is None
    assert user.username is TEST_USER_DATA["username"]
    assert user.email is TEST_USER_DATA["email"]
    assert user.password is not TEST_USER_DATA["password"]  # password should be hashed
    assert user.name is TEST_USER_DATA["name"]
    assert user.surname is TEST_USER_DATA["surname"]


@pytest.mark.skip
def test_insert_user(client):
    user = User(TEST_USER_DATA)
    user.save()
    user_from_db = User.get(1)  # database was empty
    assert user_from_db.username is user.username, user_from_db
