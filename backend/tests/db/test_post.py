import pytest
from api.db.post import Post


def test_get_with_empty_db(client):
    post = Post.get(1)
    assert post is None
