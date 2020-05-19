from flask import Flask, url_for
from markupsafe import escape
import json

from db.user import User
#import db.user as user

app = Flask(__name__)
#db = mariadb.connect()


@app.route('/')
def index():
    return "<h1>Wlog</h1><p>First setup works!!</p>"


@app.route('/hello/<name>')
def hello(name):
    return "moin wie gehts dir " + name


@app.route('/dbtest/get/<id>')
def dbGet(id):
    return json.dumps(User.get(id)[1])


@app.route('/dbtest/add')
def dbAdd():
    user = User("Walter32", "walter.maier@gmail.com",
                "passwort22", "Walter", "Meier")
    #user.description = "bliblablub"
    #user.profilpicture = "pp_peter224"
    return str(user.insert())
