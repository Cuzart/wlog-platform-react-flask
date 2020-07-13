# import pytest
import json

POST_DATA = {
    'trip_id': 1,
    'post': {
        'subtitle': 'Testasia',
        'location_label': 'testerland',
        'location_longitude': 127.12213412,
        'location_latitude': -12.2312321,
        'text': 'ganz viel Spaß in Testasia'
    }
}


class TestPostsController():
    """Class to test the posts controller.
    Is using the client fixture defined in 'conftest.py'
    Values to compare are defined in 'insert_test_wlog.sql' and got inserted before
    """

    def test_create_post(self, client):
        rv = client.post('/posts', data=json.dumps(POST_DATA), content_type='application/json')
        assert rv.status_code == 401
        assert b'Unauthorized' in rv.data

        credentials = {'username': 'test_user', 'password': 'password'}
        client.post('/login', data=json.dumps(credentials), content_type='application/json')
        rv = client.post('/posts', data=json.dumps(POST_DATA), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 0
        assert response['status'] == 'post successfully created'

        POST_DATA['trip_id'] = -123
        rv = client.post('/posts', data=json.dumps(POST_DATA), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 2
        assert response['status'] == 'no valid trip found'

        POST_DATA['trip_id'] = 1
        del POST_DATA['post']['text']
        rv = client.post('/posts', data=json.dumps(POST_DATA), content_type='application/json')
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == 'invalid request, attributes missing'

    def test_get_new_posts(self, client):
        rv = client.get('/posts')
        posts = rv.get_json()
        assert type(posts) is list
        assert len(posts) == 2  # one created one through db setup
        post_att = ('id', 'trip_id', 'subtitle', 'location_label',
                    'location_longitude', 'location_latitude', 'text', 'created_at')
        assert all(key in posts[0] for key in post_att)
        assert posts[1]['subtitle'] != POST_DATA['post']['subtitle']    # should not be the second one, new ones first
        assert posts[0]['subtitle'] == POST_DATA['post']['subtitle']
        assert posts[0]['id'] > posts[1]['id']
        assert posts[0]['created_at'] >= posts[1]['created_at']
