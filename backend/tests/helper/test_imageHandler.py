import uuid
import os.path
from werkzeug.datastructures import FileStorage
import api.helper.imageHandler as image_handler


class TestImageHandler():
    """Class to test the image handler.
    Is using the app_context fixture defined in 'conftest.py'
    """

    def test_allowed_img(self, app_context):
        assert not image_handler.allowed_img('test.sh')
        assert not image_handler.allowed_img('test.txt')
        assert image_handler.allowed_img('test.jpg')
        assert image_handler.allowed_img('test.jpeg')
        assert image_handler.allowed_img('test.png')

    def test_store_save_remove(self, app_context):
        # first store a tmp image and return a uid
        image = FileStorage(open('tests/helper/test.png', 'rb'))
        uid = image_handler.store_tmp_img(image)
        assert isinstance(uid, uuid.UUID)
        assert image_handler.tmp_img_stored(uid)
        # save image, normally if metadata were posted
        filename = image_handler.save_image(uid, 1, 'test')
        assert '000001_test' in filename
        assert not image_handler.tmp_img_stored(uid)
        image_handler.remove_image(filename)
        assert not os.path.isfile('/usr/src/app/assets/{}'.format(filename))

    def test_save_post_img(self, app_context):
        """post images a handeled seperatly because of restrictions due to TinyMSC
        """
        image = FileStorage(open('tests/helper/test.png', 'rb'))
        filename = image_handler.save_post_img(1, image)
        assert '000001_postImg' in filename
        assert os.path.isfile('/usr/src/app/assets/{}'.format(filename))
        image_handler.remove_image(filename)
