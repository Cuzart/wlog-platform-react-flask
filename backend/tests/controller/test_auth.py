# import pytest
import flask
import json


class TestAuthController():
    """Class to test the auth controller.
    Is using the client fixture defined in 'conftest.py'
    Values used are defined in 'insert_test_wlog.sql' and got inserted before
    """

    def test_login(self, client):
        credentials = {'username': 'test_user', 'password': 'wrong_password'}
        rv = client.post('/login', data=json.dumps(credentials), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == 'invalid username or password'

        credentials = {'username': 'test_user', 'password': 'password'}
        rv = client.post('/login', data=json.dumps(credentials), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 0
        assert response['status'] == 'successfully logged in'
        assert flask.session['id'] == response['user_id']

    def test_logout(self, client):
        rv = client.get('/logout')
        response = rv.get_json()
        assert response['statusCode'] == 0
        assert response['status'] == 'successfully logged out'
        assert flask.session.get('id') is None

    def test_register(self, client):
        new_user = {
            'username': 'test_user',
            'email': 'test@mail.com',
            'password': 'strenggeheim',
            'name': 'Otto',
            'surname': 'Walter'
        }
        rv = client.post('/register', data=json.dumps(new_user), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == 'username not available'

        new_user['username'] = 'Otto123'
        rv = client.post('/register', data=json.dumps(new_user), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 0
        assert response['status'] == 'successfully registered'
        rv = client.get('users/2')
        response = rv.get_json()
        assert response['username'] == new_user['username']
        assert response['name'] == new_user['name']
