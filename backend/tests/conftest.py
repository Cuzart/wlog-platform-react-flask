import pytest
from api import app
from api import conn_pool
from api.helper.instanceCache import InstanceCache


TEST_DB_CONFIG = {
    'database': "test_wlog",
}


##################
##   FIXTURES   ##
##################
@pytest.fixture(scope="class")
def client():
    """ returns a client for testing requests"""
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            conn_pool.set_config(**TEST_DB_CONFIG)
            init_test_db()
            insert_test_user()
            # clear instance cache, that nothing is cached from other tests
            InstanceCache.clear()
        yield client

    remove_test_db()


@pytest.fixture(scope="class")
def app_context():
    """ many functions need a app_context
    this function should be used per module the have app_context and a test_database
    database and its content remains the same for the module
    """
    app.config['TESTING'] = True

    with app.app_context():
        conn_pool.set_config(**TEST_DB_CONFIG)
        init_test_db()
        # clear instance cache, that nothing is cached from other tests
        InstanceCache.clear()
        yield True

    remove_test_db()


################################
##  SETUP TEST_WLOG DATABASE  ##
################################

def init_test_db():
    """ initialize 'test_wlog' db with identical structure
    """
    sql_commands = get_sql_commands("/usr/src/app/sql_dump/test_wlog.sql")
    cnx = conn_pool.get_connection()
    cursor = cnx.cursor()
    for command in sql_commands:
        if command != '':
            cursor.execute(command)
    cnx.commit()
    cnx.close()


def insert_test_user():
    sql_commands = get_sql_commands("/usr/src/app/sql_dump/insert_test_wlog.sql")
    cnx = conn_pool.get_connection()
    cursor = cnx.cursor()
    for command in sql_commands:
        if command != '':
            cursor.execute(command)
    cnx.commit()
    cnx.close()


def remove_test_db():
    """ remove 'test_wlog' db after use
    """
    sql_commands = get_sql_commands("/usr/src/app/sql_dump/drop_test_wlog.sql")
    cnx = conn_pool.get_connection()
    cursor = cnx.cursor()
    for command in sql_commands:
        if command != '':
            cursor.execute(command)
    cnx.commit()
    cnx.close()


def get_sql_commands(file):
    fd = open(file)
    sql_file = fd.read()
    fd.close()
    sql_commands = sql_file.split(';')
    sql_commands = [sql.strip() for sql in sql_commands]
    return sql_commands
