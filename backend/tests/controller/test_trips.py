# import pytest
import json

TRIP_DATA = {
   'title': 'MyAwesomeTrip', 
   'country': 'Mars', 
   'description': 'Lorum Ipsum...'
}


class TestUsersController():
    """Class to Test the test controller.
    Is using the client fixture defined in 'conftest.py'
    Values to compare are defined in 'insert_test_wlog.sql' and got inserted before
    """

    def test_get_trip(self, client):
        rv = client.get('/trips/1')
        trip_data = rv.get_json()
        trip_att = ('id', 'user_id', 'author', 'title', 'country', 'description', 'thumbnail', 'posts')
        assert all(key in trip_data for key in trip_att)
        assert trip_data['title'] == 'Work&Travel'
        assert trip_data['author'] == 'test_user'
        assert trip_data['user_id'] == 1

        rv = client.get('/trips/1234')
        trip_data = rv.get_json()
        assert trip_data == {}

    def test_create_trip(self, client):
        rv = client.post('/trips', data=json.dumps(TRIP_DATA), content_type='application/json')
        assert rv.status_code == 401
        assert b'Unauthorized' in rv.data

        credentials = {'username': 'test_user', 'password': 'password'}
        client.post('/login', data=json.dumps(credentials), content_type='application/json')

        rv = client.post('/trips', data=json.dumps(TRIP_DATA), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 2
        assert response['status'] == 'thumbnail missing'

        # upload img ...
        # rv = client.post('/trips', data=json.dumps(TRIP_DATA), content_type='application/json')
        # response = rv.get_json()
        # assert response['statusCode'] == 0
        # assert response['status'] == 'post successfully created'

        del TRIP_DATA['country']
        rv = client.post('/trips', data=json.dumps(TRIP_DATA), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == 'invalid request, attributes missing'

    def test_get_new_trips(self, client):
        rv = client.get('/trips')
        trips = rv.get_json()
        assert type(trips) is list
        assert len(trips) == 2 # one created one through db setup
        assert trips[1]['title'] != TRIP_DATA['title']    # should not be the second one, new ones first
        assert trips[0]['title'] == TRIP_DATA['title']
        assert trips[0]['id'] > trips[1]['id']
        assert trips[0]['created_at'] >= trips[1]['created_at']
