from flask import request
from flask import session
from flask import Blueprint
from flask import current_app
from functools import wraps
from api.db.user import User


bp = Blueprint("auth", __name__)


def login_required(f):
    """checks if user is logged in"""
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'id' in session:
            return f(*args, **kwargs)
        else:
            return "Unauthorized", 401
    return wrap


@bp.route('/login', methods=["POST"])
def login():
    """Endpoint to login. User can login with his credentials.
    Some important variables get stored in the session

    Returns:
        json: status message
    """
    if request.is_json:
        login_data = request.get_json()
        username = login_data['username']
        password_candidate = login_data['password']
        id = User.check_login(username, password_candidate)
        if type(id) is int:
            # passed
            session['id'] = id
            return {'statusCode': 0, 'status': 'successfully logged in', 'user_id': id}
        else:
            return {'statusCode': 1, 'status': 'invalid username or password'}
    else:
        return "Bad Request", 400


@bp.route('/logout')
def logout():
    session.clear()
    return {'statusCode': 0, 'status': 'successfully logged out'}


@bp.route('/register', methods=["POST"])
def register():
    """Endpoint to register a new user.
    User input gets validated. Checks if username is still available.
    If request is valid new user gets saved to DB (registered)

    Returns:
        json: status message
    """
    if request.is_json:
        user_data = request.get_json()
        error = User.validate_user_input(user_data)
        if len(error) > 0:
            if "Username not available" in error:
                return {'statusCode': 1, 'status': 'username not available'}
            else:
                # should normally not happen because Fronted validates aswell
                error_msg = ', '.join(error)
                current_app.logger.warning(
                    "Invalid register post. JSON was not validated: {}".format(error_msg))
                return {'statusCode': 2, 'status': 'other error', 'error': error_msg}

        if User.register(user_data):
            return {'statusCode': 0, 'status': 'successfully registered'}
        else:
            return {'statusCode': 3, 'status': 'could not register user'}
    else:
        return "Bad Request", 400
