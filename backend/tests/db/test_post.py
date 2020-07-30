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
    'trip_id': 1,
    'subtitle': 'Testasia',
    'location_label': 'testerland',
    'location_longitude': 127.12213412,
    'location_latitude': -12.2312321,
    'text': 'ganz viel Spaß in Testasia'
}


class TestPostModel():
    """Class to test the post db model.
    Is using the app_context fixture defined in 'conftest.py'
    the fixture is setting up an empty 'test_wlog' db
    functions are running in the flask app_context. some of them depend on it
    """

    def test_get_with_empty_db(self, app_context):
        post = Post.get(1)
        assert post is None

    def test_post_instance(self, app_context):
        post = Post(POST_DATA)
        assert post.id is None
        assert post.subtitle is POST_DATA['subtitle']
        assert post.location_label is POST_DATA['location_label']
        assert post.location_longitude is POST_DATA['location_longitude']
        assert post.location_latitude is POST_DATA['location_latitude']
        assert post.text is POST_DATA['text']

    def test_insert(self, app_context):
        post = Post(POST_DATA)
        assert post.save() is None  # no valid trip yet!
        user = User(USER_DATA)  # Create user and trip
        user.save()
        trip = Trip(TRIP_DATA)
        trip.save()
        id = post.save()
        post_from_db = Post.get(id)
        assert post_from_db.subtitle == post.subtitle
        assert post_from_db.location_label == post.location_label
        assert post_from_db.text == post.text 

    def test_update(self, app_context):
        post = Post.get(2)  # 2 because first insert should have failed
        post.text = 'Hallo ich teste mich gerade'
        assert post.save() == 2
        InstanceCache.clear()   # to get entry out of db
        same_post = Post.get(2)
        assert post.text == same_post.text
        assert post.subtitle == same_post.subtitle
        assert post.created_at == same_post.created_at

    def test_delete(self, app_context):
        post = Post.get(2)
        post.delete()
        assert post.get(2) is None
