# import pytest
from api.db.trip import Trip


def test_get_with_empty_db(app_context):
    trip = Trip.get(1)
    assert trip is None
