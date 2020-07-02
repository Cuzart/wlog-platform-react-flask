from flask import request
from flask import session
from flask import Blueprint
from api.db.user import User
from api.controller.auth import login_required


bp = Blueprint("users", __name__)


@bp.route('/users/<int:id>', methods=["GET"])
def get_user(id):
    return User.get_profile_data(id)


@bp.route('/users/<int:id>', methods=["PATCH"])
@login_required
def edit_profile(id):
    """Endpoint to update a users profile. 

    Returns:
        json: status message
    """
    if request.is_json:
        if id is not session['id']:
            return "Forbidden", 403
        user_data = request.get_json()
        req_att = ("name", "surname", "description")
        if not all(key in user_data for key in req_att):
            return {'statusCode': 1, 'status': "invalid request, attributes missing"}
        if User.edit_profile(session["id"], user_data):
            return {'statusCode': 0, 'status': "user profile successfully updated"}
        else:
            return {'statusCode': 2, 'status': "could not update user profile"}
    else:
        return "Bad Request", 400
