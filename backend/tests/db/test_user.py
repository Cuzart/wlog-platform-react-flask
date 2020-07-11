from api.db.user import User
from api.helper.instanceCache import InstanceCache


USER_DATA = [
    {
        "username": "test_user",
        "email": "test@mail.com",
        "password": "password",
        "name": "Max",
        "surname": "Mustermann",
    },
    {
        "username": "heini",
        "email": "test2@mail.com",
        "password": "passwd",
        "name": "Heinrich",
        "surname": "Wurst",
    },
]
INVALID_DATA = [
    {
        "username": "te",
        "email": "testmai",
        "password": "12345",
        "name": "M",
        "surname": "MustermannMustermannMustermannMustermannMustermannMustermann",
    },
    {
        "username": "test_user",
        "email": "test2@mailcom",
        "password": "passwdgj",
        "name": "Wurst",
        "surname": "Leber",
    },
]

class TestUserModel():

    def test_get_with_empty_db(self, app_context):
        user = User.get(1)
        assert user is None


    def test_user_instance(self, app_context):
        user = User(USER_DATA[0])
        assert user.id is None
        assert user.username is USER_DATA[0]["username"]
        assert user.email is USER_DATA[0]["email"]
        assert user.password is USER_DATA[0]["password"]
        assert user.name is USER_DATA[0]["name"]
        assert user.surname is USER_DATA[0]["surname"]


    def test_insert(self, app_context):
        user = User(USER_DATA[0])
        id = user.save()
        print(id)
        print(user.__dict__)
        user_from_db = User.get(id)
        print(user_from_db.__dict__)
        assert user_from_db.username == user.username
        assert user_from_db.email == user.email
        assert user_from_db.password == user.password
        assert user_from_db.name == user.name
        assert user_from_db.surname == user.surname


    def test_is_username_available(self, app_context):
        assert User.is_username_available('Otto') is True
        assert User.is_username_available(USER_DATA[0]['username']) is False


    def test_validate_user_input_1(self, app_context):
        error = User.validate_user_input(INVALID_DATA[0])
        assert 'Invalid username' in error
        assert 'Invalid email' in error
        assert 'Password to short' in error
        assert 'Invalid name' in error
        assert 'Invalid surname' in error


    def test_validate_user_input_2(self, app_context):
        error = User.validate_user_input(INVALID_DATA[1])
        assert 'Username not available' in error
        assert 'Invalid email' in error
        assert 'Password to short' not in error
        assert 'Invalid name' not in error
        assert 'Invalid surname' not in error


    def test_register(self, app_context):
        assert User.register(USER_DATA[1])
        user = User.get(2)  # second insert
        assert user.password != USER_DATA[1]['password']  # should be hashed


    def test_check_login(self, app_context):
        assert User.check_login(USER_DATA[1]['username'], USER_DATA[1]['password'])
        assert User.check_login(USER_DATA[1]['username'], 'einanderespasswd') is False


    def test_get_profile_data(self, app_context):
        profile_data = User.get_profile_data(2)
        assert type(profile_data) is dict
        assert 'password' not in profile_data
        assert 'email' not in profile_data
        assert 'created_at' not in profile_data
        assert 'username' in profile_data


    def test_search(self, app_context):
        users = User.search('hei')
        assert type(users) is list
        assert users[0]['username'] == USER_DATA[1]['username']


    def test_update(self, app_context):
        user = User.get(1)
        user.description = "Hallo ich teste mich gerade"
        assert user.save() == 1
        same_user = User.get(1)
        assert user.description == same_user.description
        assert user.username == same_user.username


    def test_edit_profile(self, app_context):
        old_user = User.get(1)
        assert User.edit_profile(1, {'description': 'Ich bin ein tester'})
        new_user = User.get(1)
        assert old_user.description != new_user.description
        assert old_user.username == new_user.username


    def test_delete(self, app_context):
        user = User.get(1)
        user.delete()
        assert User.get(1) is None
