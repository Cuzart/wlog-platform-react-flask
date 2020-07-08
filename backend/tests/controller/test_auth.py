# import pytest


def test_empty_db(client):
    rv = client.get('/users/1')
    assert b'{}' in rv.data
