from flask import request
from flask import session
from flask import Blueprint
from flask import jsonify
from api.db.trip import Trip
from api.controller.auth import login_required
import api.helper.imageHandler as img_handler


bp = Blueprint("trips", __name__)


@bp.route('/trips', methods=["GET"])
def get_new_trips():
    return jsonify(Trip.get_new_trips())


@bp.route('/trips/<int:id>', methods=["GET"])
def get_trip(id):
    trip_data = Trip.get_trip_data(id)
    if trip_data: 
        if session.get('id') is None:
            trip_data['user_clapped'] = False
        else:
            trip_data['user_clapped'] = Trip.has_user_clapped(id, session['id'])
    return trip_data


@bp.route('/trips', methods=["POST"])
@login_required
def create_trip():
    """Endpoint to create a new trip. Beforehand, a thumbnail needs to be sended to /upload.
    Checks if request is valid. Stores corresponding image and saves new trip to DB.

    Returns:
        json: status message
    """
    if request.is_json:
        trip_data = request.get_json()
        req_att = ("title", "country", "description")
        if not all(key in trip_data for key in req_att):
            return {'statusCode': 1, 'status': "invalid request, attributes missing"}

        file_uid = session.get('file_upload_uid')
        if img_handler.tmp_img_stored(file_uid):
            filename = img_handler.save_image(
                file_uid, session["id"], 'thumbnail')
            trip_data['user_id'] = session["id"]
            trip_data['thumbnail'] = "/images/{}".format(filename)
            trip = Trip(trip_data)
            trip_id = trip.save()
            del session['file_upload_uid']
            if trip_id is None:     # in case trip can't be saved to db remove stored thumbnail
                img_handler.remove_image(trip_data['thumbnail'])
                return {'statusCode': 3, 'status': "could not save trip"}
            return {'statusCode': 0, 'status': "trip successfully created", 'trip_id': trip_id}
        else:
            return {'statusCode': 2, 'status': "thumbnail missing"}
    else:
        return "Bad Request", 400


@bp.route('/trips/<int:id>/claps', methods=["GET"])
def get_claps(id):
    return {'claps': Trip.get_claps(id)}


@bp.route('/trips/<int:id>/claps', methods=["POST"])
@login_required
def add_clap(id):
    trip = Trip.get(id)
    if trip is None:
        return {'statusCode': 1, 'status': "no valid trip found"}
    if trip.add_clap(session['id']):
        return {'statusCode': 0, 'status': "successfully clapped"}
    else:
        return {'statusCode': 2, 'status': "already clapped"}


@bp.route('/trips/<int:id>/claps', methods=["DELETE"])
def delete_clap(id):
    trip = Trip.get(id)
    if trip is None:
        return {'statusCode': 1, 'status': "no valid trip found"}
    if trip.delete_clap(session['id']):
        return {'statusCode': 0, 'status': "successfully unclapped"}
    else:
        return {'statusCode': 2, 'status': "could not delete clap"}


@bp.route('/trips/<int:id>', methods=["PATCH"])
@login_required
def edit_trip(id):
    # TODO
    pass


@bp.route('/trips/<int:id>', methods=["DELETE"])
@login_required
def delete_trip(id):
    # TODO
    pass
