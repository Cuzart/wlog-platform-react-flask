# import pytest
from api.db.trip import Trip
from api.db.user import User
from api.db.post import Post
from api.helper.instanceCache import InstanceCache

USER_DATA = {
    'username': 'test_user',
    'email': 'test@mail.com',
    'password': 'password',
    'name': 'Max',
    'surname': 'Mustermann',
}
TRIP_DATA = {
    'user_id': 1,
    'title': 'MyAwesomeTrip',
    'country': 'Mars',
    'description': 'Lorum Ipsum...',
    'thumbnail': '/images/bliblablub.png',
}
POST_DATA = {
    'subtitle': 'Testasia',
    'location_label': 'testerland',
    'location_longitude': 127.12213412,
    'location_latitude': -12.2312321,
    'text': 'ganz viel Spaß in Testasia'
}


class TestTripModel():
    """Class to test the trip db model.
    Is using the app_context fixture defined in 'conftest.py'
    the fixture is setting up an empty 'test_wlog' db
    functions are running in the flask app_context. some of them depend on it
    """

    def test_get_with_empty_db(self, app_context):
        trip = Trip.get(1)
        assert trip is None

    def test_trip_instance(self, app_context):
        trip = Trip(TRIP_DATA)
        assert trip.id is None
        assert trip.title is TRIP_DATA['title']
        assert trip.country is TRIP_DATA['country']
        assert trip.description is TRIP_DATA['description']

    def test_insert(self, app_context):
        trip = Trip(TRIP_DATA)
        assert trip.save() is None  # no valid user_id
        user = User(USER_DATA)
        user.save()
        id = trip.save()
        trip_from_db = Trip.get(id)
        assert trip_from_db.title == trip.title
        assert trip_from_db.country == trip.country
        assert trip_from_db.description == trip.description

    def test_add_post(self, app_context):
        trip = Trip.get(2)  # 2, because first insert failed. normally validated before
        assert trip.add_post(POST_DATA)

    def test_get_trip_data(self, app_context):
        trip_data = Trip.get_trip_data(2)
        assert type(trip_data) is dict
        assert trip_data['author'] == USER_DATA['username']
        assert trip_data['title'] == TRIP_DATA['title']
        assert type(trip_data['posts']) is list
        assert len(trip_data['posts']) == 1
        post_data = trip_data['posts'][0]
        assert post_data['subtitle'] == POST_DATA['subtitle']

    def test_update(self, app_context):
        trip = Trip.get(2)
        trip.description = 'Hallo ich teste mich gerade'
        assert trip.save() == 2
        InstanceCache.clear()  # to get entry out of db
        same_trip = Trip.get(2)
        assert trip.description == same_trip.description
        assert trip.title == same_trip.title
        assert trip.created_at == same_trip.created_at

    def test_delete(self, app_context):
        trip = Trip.get(2)
        assert trip.delete() is None    # cannot delete trip if post still exists
        post = Post.get(1)
        post.delete()
        trip.delete()
        assert Trip.get(2) is None
