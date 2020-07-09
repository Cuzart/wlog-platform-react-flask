from flask import request
from flask import session
from flask import Blueprint
from flask import jsonify
from api.db.user import User
from api.db.trip import Trip
from api.db.post import Post
from api.controller.auth import login_required


bp = Blueprint("users", __name__)


@bp.route('/users/<int:id>', methods=["GET"])
def get_user(id):
    return User.get_profile_data(id)


@bp.route('/users/<int:id>/trips', methods=["GET"])
def get_user_trips(id):
    """Endpoint to get all trips of a specific user

    Returns:
        json: a list of trips of the user
    """
    return jsonify(Trip.get_all_user_trips(id))


@bp.route('/users/<int:id>/posts', methods=["GET"])
def get_user_posts(id):
    """Endpoint to get all posts of a specific user

    Returns:
        json: a list of posts of the user
    """
    return jsonify(Post.get_all_user_posts(id))


@bp.route('/users/<int:id>', methods=["PATCH"])
@login_required
def edit_profile(id):
    """Endpoint to update a users profile.
    At the moment only description in the future more..

    Returns:
        json: status message
    """
    if request.is_json:
        if id is not session['id']:
            return "Forbidden", 403
        user_data = request.get_json()
        req_att = ("description",)
        if not all(key in user_data for key in req_att):
            return {'statusCode': 1, 'status': "invalid request, attributes missing"}
        if User.edit_profile(session["id"], user_data):
            return {'statusCode': 0, 'status': "user profile successfully updated"}
        else:
            return {'statusCode': 2, 'status': "could not update user profile"}
    else:
        return "Bad Request", 400


@bp.route('/users/search', methods=["GET"])
def search_users():
    """Endpoint to search users

    Returns:
        json: a list of matching users with id and username. else status message
    """
    pattern = request.args.get('pattern')
    if pattern is None:
        return {'statusCode': 2, 'status': "argument 'pattern' missing"}
    if len(pattern) < 3:
        return {'statusCode': 1, 'status': "pattern needs at least 3 characters"}

    return jsonify(User.search(pattern))
