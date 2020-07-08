import pytest
from api import app
from api import conn_pool


TEST_DB_CONFIG = {
    'database': "test_wlog",
}


@pytest.fixture
def client():
    """ returns a client for testing requests"""
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            conn_pool.set_config(**TEST_DB_CONFIG)
            init_test_db()
        yield client


def init_test_db():
    """ initialize 'test_wlog' db with identical structure

    Returns:
        a database connection instance
    """

    fd = open("/usr/src/app/sql_dump/test_wlog.sql")
    sqlFile = fd.read()
    fd.close()
    sql_commands = sqlFile.split(';')

    cnx = conn_pool.get_connection()
    cursor = cnx.cursor()
    for command in sql_commands:
        if command.strip() != '':
            cursor.execute(command + ";")
    cnx.commit()
    cnx.close()
