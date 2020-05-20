from flask import Flask, url_for, request, jsonify
from markupsafe import escape
import json

from db.user import User

app = Flask(__name__)


@app.route('/')
def index():
    return """<h1>Wlog</h1><p>Coding..</p>
            <div><a href="/agilTest">Testseite Agil</a></div><br>
            <div><a href="/jonasTest">Testseite Jonas</a></div>
            """


@app.route('/hello/<name>')
def hello(name):
    return "moin wie gehts dir " + name


@app.route('/profil/<int:id>')
def getUser(id):
    return jsonify(User.get(id))


@app.route('/register', methods=["POST"])
def register():
    if request.is_json:
        userData = request.get_json()

    # check userData somehow..
    user = User(userData["username"], userData["email"],
                userData["password"], userData["name"], userData["surname"])
    app.logger.debug(type(user.id))
    user.save()
    return "worked", 200
