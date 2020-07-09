# import pytest


def test_empty_db(client):
    rv = client.get('/users/1')
    assert b'{}' in rv.data


# def test_edit_profile(client):
#     rv = client.patch('/users/1')
#     assert 'hallo' in rv.data