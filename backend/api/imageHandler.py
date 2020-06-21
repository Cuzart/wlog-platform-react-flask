import uuid
import os
import shutil
import time
from werkzeug.utils import secure_filename


ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

IMG_PATH = "/usr/src/app/assets"
TMP_IMG_PATH = "/usr/src/app/assets/tmp"


tmp_files = {}


def save_post_img(user_id, file):
    """saves a post image with the corresponding user_id and a timestamp

    Args:
        user_id (int): id of user
        file (fileStorage): file to be saved

    Returns:
        string: filename of saved image
    """
    filename = secure_filename(file.filename)
    extension = filename.rsplit('.', 1)[1]
    timestamp = str(time.time()).replace(".", "")

    filename = "{}_postImg_{}.{}".format(
        str(user_id).zfill(6), timestamp, extension)
    file.save(os.path.join(IMG_PATH, filename))
    return filename


def store_tmp_img(file):
    """in case of a thumbnail or profil picture the img gets tmp stored
    and a uid gets returned to refer to it in the next request 

    Args:
        file (fileStorage): file to be stored

    Returns:
        string: uid to refer to tmp img 
    """
    filename = secure_filename(file.filename)
    uid = uuid.uuid4()
    tmp_files[uid] = filename
    file.save(os.path.join(TMP_IMG_PATH, filename))
    return uid


def save_image(uid, user_id, filetype):
    """saves a tmp image permanently

    Args:
        uid (string): uid under which imgage got stored
        user_id (ing): id of user the image belongs
        filetype (string): thumbnail or profileImg
    """
    extension = tmp_files[uid].rsplit('.', 1)[1]
    timestamp = str(time.time()).replace(".", "")
    new_filename = "{}_{}_{}.{}".format(
        str(user_id).zfill(6), filetype, timestamp, extension)

    shutil.move("{}/{}".format(TMP_IMG_PATH, tmp_files[uid]),
                "{}/{}".format(IMG_PATH, new_filename))

    del tmp_files[uid]
    return new_filename

# def remove_tmp_images(uid):
#     for img in tmp_files[uid]:
#         os.remove("{}/{}".format(TMP_IMG_PATH, img[1]))
#     del tmp_files[uid]


def allowed_img(filename):
    """checks if filename is allowed

    Args:
        filename (string): name of file

    Returns:
        bool: True or False
    """
    if filename == '':
        return False
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS


def tmp_img_stored(uid):
    """checks if a img was stored to the given uid

    Args:
        uid (string): provided uid

    Returns:
        bool: True or False
    """
    if uid in tmp_files:
        return True
    return False


def remove_image(filename):
    """remove a saved image

    Args:
        filename (string): saved image in DB
    """
    filename = filename.replace("img/", "")
    os.remove("{}/{}".format(IMG_PATH, filename))