# import pytest
from api.db.post import Post


class TestPostModel():
    """Class to test the post db model.
    Is using the app_context fixture defined in 'conftest.py'
    the fixture is setting up an empty 'test_wlog' db
    functions are running in the flask app_context. some of them depend on it
    """

    def test_get_with_empty_db(self, app_context):
        post = Post.get(1)
        assert post is None
