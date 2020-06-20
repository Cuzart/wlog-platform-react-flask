from api import app
from flask import request, session, send_from_directory
from functools import wraps
import os
import json
# from markupsafe import escape !!! TODO

# own modules
from api.db.user import User
from api.db.trip import Trip
from api.db.post import Post
import api.imageHandler as img_handler


def login_required(f):
    """checks if user is logged in
    """
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return "Unauthorized", 401
    return wrap


@app.route('/')
def index():
    return "Wlog - API"


@app.route('/profile/<int:id>')
def get_user(id):
    return User.get_profile_data(id)


@app.route('/trip/<int:id>')
def get_trip(id):
    return Trip.get_trip_data(id)


@app.route('/login', methods=["POST"])
def login():
    if request.is_json:
        login_data = request.get_json()

        username = login_data['username']
        password_candidate = login_data['password']
        id = User.check_login(username, password_candidate)
        if type(id) is int:
            # passed
            session['logged_in'] = True
            session['id'] = id
            session['username'] = username
            return {'statusCode': 0, 'status': 'successfully logged in'}
        else:
            return {'statusCode': 1, 'status': 'invalid username or password'}
    else:
        return "Bad Request", 400


@app.route('/logout')
def logout():
    session.clear()
    return {'statusCode': 0, 'status': 'successfully logged out'}


@app.route('/register', methods=["POST"])
def register():
    if request.is_json:
        user_data = request.get_json()
        error = User.validate_user_input(user_data)
        if len(error) > 0:
            if "Username not available" in error:
                return {'statusCode': 1, 'status': 'Username not available'}
            else:
                # should normally not happen because Fronted validates aswell
                error_msg = ', '.join(error)
                app.logger.warning(
                    "Invalid register post. JSON was not validated: {}".format(error_msg))
                return {'statusCode': 2, 'status': 'Other error', 'error': error_msg}

        user = User(user_data)
        user.save()
        return {'statusCode': 0, 'status': 'successfully registered'}
    else:
        return "Bad Request", 400


@app.route('/createTrip', methods=["POST"])
@login_required
def createTrip():
    if request.is_json:
        app.logger.info(request.get_json())
        return "hallo"
        file_uid = session.get('file_upload_uid')
        trip_data = request.get_json()
        if img_handler.tmp_image_stored(file_uid):
            filename = img_handler.save_image(
                file_uid, session["id"], 'thumbnail')
            trip_data['user_id'] = session["id"]
            trip_data['thumbnail'] = "/img/{}".format(filename)
            trip = Trip(trip_data)
            trip_id = trip.save()
            del session['file_upload_uid']
            return {'statusCode': 0, 'status': "Trip successfully created", 'tripId': trip_id}

    else:
        return "Bad Request", 400


@app.route('/createPost', methods=["POST"])
@login_required
def createPost():
    if request.is_json:
        req_data = request.get_json()

        trip = Trip.get(req_data.get("trip_id"))
        if trip is None:
            return {'statusCode': 1, 'status': "no valid trip"}

        post_data = req_data["post"]
        trip.add_post(post_data)
        return {'statusCode': 0, 'status': "Post successfully created"}
    else:
        return "Bad Request", 400


@app.route('/uploadImg', methods=["POST"])
@login_required
def upload():
    if len(request.files) == 1:
        files = request.files

        # for post images
        if 'postImg' in files:
            if img_handler.allowed_img(files['postImg'].filename):
                filename = img_handler.save_post_img(
                    session['id'], files['postImg'])
                return {'location': "/img/{}".format(filename)}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}

        # for creating a trip, thumbnail upload
        # or for adding a profil picture
        elif 'thumbnail' in files or 'profileImg' in files:
            file = files[0]
            if img_handler.allowed_img(file.filename):
                uid = img_handler.store_tmp_img(file)
                session['file_upload_uid'] = uid
                return {'statusCode': 0, 'status': "file temporarily saved"}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}

    else:
        return {'statusCode': 1, 'status': "invalid upload"}


@app.route('/img/<filename>')
def get_img(filename):
    return send_from_directory("/usr/src/app/assets", filename)
