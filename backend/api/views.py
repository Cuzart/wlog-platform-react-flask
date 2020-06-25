from api import app
from flask import request, session, send_from_directory
from functools import wraps
import os
import json

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


#######################
#   GETTER REQUESTS   #
#######################
@app.route('/profile/<int:id>')
def get_user(id):
    return User.get_profile_data(id)


@app.route('/trip/<int:id>')
def get_trip(id):
    return Trip.get_trip_data(id)


@app.route('/img/<string:filename>')
def get_img(filename):
    return send_from_directory("/usr/src/app/assets", filename)


##################################
#   LOGIN, LOGOUT AND REGISTER   #
##################################
@app.route('/login', methods=["POST"])
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


#######################
#    TRIP FUNCTIONS   #
#######################
@app.route('/createTrip', methods=["POST"])
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
            trip_data['thumbnail'] = "/img/{}".format(filename)
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


@app.route('/editTrip', methods=["POST"])
@login_required
def edit_trip():
    # TODO
    pass


@app.route('/deleteTrip')
@login_required
def edit_trip():
    # TODO
    pass


#######################
#    POST FUNCTIONS   #
#######################
@app.route('/createPost', methods=["POST"])
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


@app.route('/editPost', methods=["POST"])
@login_required
def edit_trip():
    # TODO
    pass


@app.route('/deletePost')
@login_required
def edit_trip():
    # TODO
    pass


###########################
#    PROFILE FUNCTIONS    #
###########################
@app.route('/editProfile', methods=["POST"])
@login_required
def edit_profile():
    """Endpoint to update a users profile. 

    Returns:
        json: status message
    """
    if request.is_json:
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



######################
#    IMAGE UPLOAD    #
######################
@app.route('/uploadImg', methods=["POST"])
@login_required
def upload_img():
    """Endpoint to upload an image. It is possible to upload an "postImg", "thumbnail", or "profileImg"
    In case of the "thumbnail", the client gets a uid to refer to the image in the next request. 
    In case of the "profileImg" the old image gets removed and the new one saved.

    Returns:
        json: status message
    """
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
        # or for adding a profile picture
        elif 'thumbnail' in files:
            file = files["thumbnail"]
            if img_handler.allowed_img(file.filename):
                uid = img_handler.store_tmp_img(file)
                session['file_upload_uid'] = uid
                return {'statusCode': 0, 'status': "file temporarily saved"}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}
        elif 'profileImg' in files:
            file = files["profileImg"]
            if img_handler.allowed_img(file.filename):
                uid = img_handler.store_tmp_img(file)
                user = User.get(session["id"])
                if user.profilepicture is not None:  # remove old profile picture
                    img_handler.remove_image(user.profilepicture)
                filename = img_handler.save_image(
                    uid, session["id"], 'profileImg')
                user.profilepicture = "/img/{}".format(filename)
                user.save()
                return {'statusCode': 3, 'status': "profileImg successfully saved"}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}

    else:
        return {'statusCode': 1, 'status': "invalid upload"}
