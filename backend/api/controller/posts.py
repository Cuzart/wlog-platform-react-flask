from flask import request
from flask import Blueprint
from flask import jsonify
from api.db.trip import Trip
from api.db.post import Post
from api.controller.auth import login_required


bp = Blueprint("posts", __name__)


@bp.route('/posts', methods=["GET"])
def get_new_posts():
    return jsonify(Post.get_new_posts())


@bp.route('/posts', methods=["POST"])
@login_required
def create_post():
    """Endpoint to create a new Post. Beforehand, post images need to be sended to /upload.
    Checks if request is valid. Saves new post to DB.

    Returns:
        json: status message
    """
    if request.is_json:
        req_data = request.get_json()
        if not all(key in req_data for key in ("trip_id", "post")):
            return {'statusCode': 1, 'status': "invalid request, attributes missing"}
        trip = Trip.get(req_data.get("trip_id"))
        if trip is None:
            return {'statusCode': 2, 'status': "no valid trip found"}

        post_data = req_data["post"]
        req_att = ("subtitle", "location_label",
                   "location_longitude", "location_latitude", "text")
        if not all(key in post_data for key in req_att):
            return {'statusCode': 1, 'status': "invalid request, attributes missing"}

        if not trip.add_post(post_data):
            # delete images in a way
            return {'statusCode': 3, 'status': "could not save post"}
        return {'statusCode': 0, 'status': "post successfully created"}
    else:
        return "Bad Request", 400


@bp.route('/posts/<int:id>', methods=["PATCH"])
@login_required
def edit_post(id):
    # TODO
    pass


@bp.route('/posts/<int:id>', methods=["DELETE"])
@login_required
def delete_post(id):
    # TODO
    pass
