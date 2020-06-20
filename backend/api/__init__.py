from flask import Flask
app = Flask(__name__)
app.secret_key = '#h23/mSsJVam^9@#2n($' # for encrypting sessions
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB

import api.views
