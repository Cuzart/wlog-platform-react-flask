from flask import Flask, url_for
from markupsafe import escape

app = Flask(__name__)


@app.route('/')
def index():
    return "<h1>Wlog</h1><p>First setup works!!</p>"

@app.route('/hello/<name>')
def hello(name):
    return "moin wie gehts dir " + name    


