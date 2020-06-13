from api import app
from flask import url_for, request, redirect, render_template, send_from_directory
import os
import json
from werkzeug.utils import secure_filename
# own modules
from api.db.user import User
from api.db.trip import Trip
from api.db.post import Post
from api.helper import allowed_file

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/profile/<int:id>')
def get_user(id):
    return User.get_profile_data(id)


@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":

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

    return redirect(url_for("/test"))


@app.route('/createTrip', methods=["POST"])
def createTrip():
    if request.method == "POST":
        req_data = request.get_json()
        user = User.get(req_data.get("userId"))
        if user is None:
            return {'statusCode': 1, 'status': "no valid user"}

        trip = req_data["trip"]
        trip["user_id"] = user.id
        post = req_data["post"]
        user.create_trip(trip, post)
        return {'statusCode': 0, 'status': "Trip successfully saved"}


@app.route('/createPost', methods=["POST"])
def createPost():
    if request.method == "POST":
        req_data = request.get_json()
        trip = Trip.get(req_data.get("tripId"))
        if trip is None:
            return {'statusCode': 1, 'status': "no valid trip"}

        post_data = req_data["post"]
        trip.add_post(post_data)
        return {'statusCode': 0, 'status': "Post successfully saved"}

#
#
# Test for uploading images
@app.route('/upload', methods=["GET", "POST"])
def upload():

    app.logger.info(request.hallo)
    return "test"

    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return 'No selected file'
        if file and allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
            filename = secure_filename(file.filename)
            file.save(os.path.join("/usr/src/app/images", filename))
            return redirect(url_for('uploaded_file',
                                    filename=filename))
    return render_template("fileUpload.html")


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory("/usr/src/app/images",
                               filename)
