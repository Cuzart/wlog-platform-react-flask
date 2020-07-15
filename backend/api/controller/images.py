from flask import request
from flask import session
from flask import Blueprint
from flask import send_from_directory
from api.db.user import User
from api.controller.auth import login_required
import api.helper.imageHandler as img_handler


bp = Blueprint("images", __name__)


@bp.route('/images/<string:filename>')
def get_image(filename):
    return send_from_directory("/usr/src/app/assets", filename)


@bp.route('/images', methods=["POST"])
@login_required
def upload_image():
    """Endpoint to upload an image. It is possible to upload an "postImg", "thumbnail", or "profileImg"
    In case of the "thumbnail", the client gets a uid to refer to the image in the next request.
    In case of the "profileImg" the old image gets removed and the new one saved.

    Returns:
        json: status message
    """
    if len(request.files) == 1:
        files = request.files
        # for post images
        if 'postImg' in files:
            if img_handler.allowed_img(files['postImg'].filename):
                filename = img_handler.save_post_img(
                    session['id'], files['postImg'])
                return {'location': "/images/{}".format(filename)}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}
        # for creating a trip, thumbnail upload
        # or for adding a profile picture
        elif 'thumbnail' in files:
            file = files["thumbnail"]
            if img_handler.allowed_img(file.filename):
                uid = img_handler.store_tmp_img(file)
                session['file_upload_uid'] = uid
                return {'statusCode': 0, 'status': "file temporarily saved"}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}
        elif 'profileImg' in files:
            file = files["profileImg"]
            if img_handler.allowed_img(file.filename):
                uid = img_handler.store_tmp_img(file)
                user = User.get(session["id"])
                if user.profilepicture is not None:  # remove old profile picture
                    img_handler.remove_image(user.profilepicture)
                filename = img_handler.save_image(uid, session["id"], 'profileImg')
                user.profilepicture = "/images/{}".format(filename)
                user.save()
                return {'statusCode': 3, 'status': "profileImg successfully saved"}
            else:
                return {'statusCode': 2, 'status': "file not allowed"}
        else:
            return {'statusCode': 4, 'status': "upload 'thumbnail', 'postImg' or 'profileImg"}

    else:
        return {'statusCode': 1, 'status': "invalid upload"}
