from flask import Flask

app = Flask(__name__)
app.secret_key = '#h23/mSsJVam^9@#2n($'  # for encrypting session cookies
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # 8 MB


@app.route('/')
def index():
    return "Wlog - API"

# import below initalizing app is important, 
# to be able to import it in other files
from api.controller import auth
from api.controller import users
from api.controller import trips
from api.controller import posts
from api.controller import images

app.register_blueprint(auth.bp)
app.register_blueprint(users.bp)
app.register_blueprint(trips.bp)
app.register_blueprint(posts.bp)
app.register_blueprint(images.bp)
