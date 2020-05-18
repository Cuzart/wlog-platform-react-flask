from flask import Flask, url_for
from markupsafe import escape
import db.mariadb as mariadb
import db.user as user

app = Flask(__name__)
db = mariadb.connect()


@app.route('/')
def index():
    return "<h1>Wlog</h1><p>First setup works!!</p>"


@app.route('/hello/<name>')
def hello(name):
    return "moin wie gehts dir " + name


@app.route('/dbtest/get')
def dbGet():

    mycursor = db.cursor()
    mycursor.execute("SELECT * FROM users")
    myresult = mycursor.fetchall()
    return str(myresult)


@app.route('/dbtest/add')
def dbAdd():
    customer = user.user("peter224", "peter.schwarz@gmail.com",
                         "324323dd", "Peter", "Schwarz")
    customer.description = "bliblablub"
    customer.profilpicture = "pp_peter224"
    return str(customer.insert())
