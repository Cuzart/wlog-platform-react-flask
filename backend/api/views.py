from api import app
from flask import url_for, request, redirect, render_template, send_from_directory
import os
import json
from werkzeug.utils import secure_filename
# own modules
from api.db.user import User
from api.helper import allowed_file

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}


@app.route('/')
def index():
    return render_template('home.html')


# development for testing sites
@app.route('/test')
def hello(name):
    return "hallo"


@app.route('/profil/<int:id>')
def get_user(id):
    user = User.get(id)
    if user is None:
        return dict()
    return user.get_dict()


@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        if not request.is_json:
            app.logger.info(request)
            return "Could not handle request", 400

        user_data = request.get_json()
        error = User.validate_user_input(user_data)
        if len(error) > 0:
            return ', '.join(error)

        user = User(user_data)
        user.save()
        return "successfully registerd"

    return redirect(url_for("/test"))


#
#
# Test for uploading images
@app.route('/upload', methods=["GET", "POST"])
def upload():
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
