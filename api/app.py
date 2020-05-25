from flask import Flask, url_for, request, jsonify, render_template
from markupsafe import escape
import json

from .db.user import User

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/<name>Test')
def hello(name):
    return render_template('{}Test.html'.format(name))


@app.route('/profil/<int:id>')
def getUser(id):
    return jsonify(User.get(id))


@app.route('/registry', methods=["POST"])
def register():
    if not request.is_json:
        app.logger.info(request)
        return "Could not handle request", 400

    userData = request.get_json()
    # check userData somehow..
    user = User(userData["username"], userData["email"],
                userData["password"], userData["name"], userData["surname"])
    user.save()
    return "successfully registerd"


if __name__ == '__main__':
    app.run()
