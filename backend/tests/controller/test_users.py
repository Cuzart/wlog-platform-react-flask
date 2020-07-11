# import pytest
import json


class TestUsersController():
    """Class to Test the users controller.
    Is using the client fixture defined in 'conftest.py'
    Values to compare are defined in 'insert_test_wlog.sql' and got inserted before
    """

    def test_get_user(self, client):
        rv = client.get('/users/1')
        user_data = rv.get_json()
        user_att = ('id', 'username', 'name', 'surname', 'description', 'profilepicture')
        assert all(key in user_data for key in user_att)
        user_private_att = ('email', 'password', 'created_at')
        assert all(key not in user_data for key in user_private_att)
        assert user_data.get('username') == 'test_user'
        assert user_data.get('name') == 'Max'
        assert user_data.get('surname') == 'Muster'

        rv = client.get('/users/1234')
        user_data = rv.get_json()
        assert user_data == {}

    def test_get_user_trips(self, client):
        rv = client.get('users/1/trips')
        trips = rv.get_json()
        assert type(trips) is list
        assert len(trips) is 1
        assert trips[0]['user_id'] == 1
        assert trips[0]['title'] == 'Work&Travel'
        assert trips[0]['author'] == 'test_user'

        rv = client.get('users/3242/trips')
        trips = rv.get_json()
        assert len(trips) is 0

    def test_get_user_posts(self, client):
        rv = client.get('users/1/posts')
        posts = rv.get_json()
        assert type(posts) is list
        assert len(posts) is 1
        assert posts[0]['trip_id'] == 1
        assert posts[0]['subtitle'] == 'Auckland'

        rv = client.get('users/3242/posts')
        posts = rv.get_json()
        assert len(posts) is 0

    def test_edit_profile(self, client):
        rv = client.patch('/users/1')       # not logged in
        assert rv.status_code == 401
        assert b'Unauthorized' in rv.data

        credentials = {'username': 'test_user', 'password': 'password'}
        client.post('/login', data=json.dumps(credentials), content_type='application/json')
        rv = client.patch('/users/1', data=json.dumps({}), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == 'invalid request, attributes missing'

        new_data = {'description': 'I love testing'}
        rv = client.patch('/users/1', data=json.dumps(new_data), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 0
        assert response['status'] == 'user profile successfully updated'
        rv = client.get('/users/1')
        user_data = rv.get_json()
        assert user_data['description'] == 'I love testing'

    def test_search_users(self, client):
        rv = client.get('/users/search')
        response = rv.get_json()
        assert response['statusCode'] == 2
        assert response['status'] == "argument 'pattern' missing"

        pattern = 'te'
        rv = client.get('/users/search?pattern={}'.format(pattern))
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == "pattern needs at least 3 characters"

        pattern = 'tes'
        rv = client.get('/users/search?pattern={}'.format(pattern))
        response = rv.get_json()
        assert type(response) is list
        assert response[0]['username'] == 'test_user'
