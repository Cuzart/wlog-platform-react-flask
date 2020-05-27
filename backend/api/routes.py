from api import app
from flask import url_for, request, render_template
import json
from api.db.user import User


@app.route('/')
def index():
    return render_template('home.html')


# development for testing sites
@app.route('/<string:name>Test')
def hello(name):
    if name == "jonas" or name == "agil":
        return render_template('{}Test.html'.format(name), data="Hallo")
    else:
        return name


@app.route('/profil/<int:id>')
def getUser(id):
    user = User.get(id)
    if user is None:
        return dict()
    return user.getDict()


@app.route('/registry', methods=["POST"])
def register():
    if not request.is_json:
        app.logger.info(request)
        return "Could not handle request", 400

    userData = request.get_json()
    if User.validateUserInput(userData) == False:
        return "error"

    user = User(userData)
    user.save()
    return "successfully registerd"
