import io
import json
from api.db.user import User
import api.helper.imageHandler as img_handler


class TestImagesConroller():
    """Class to test the images controller.
    Is using the client fixture defined in 'conftest.py'
    Values used are defined in 'insert_test_wlog.sql' and got inserted before
    """

    def test_upload_image_without_login(self, client):
        file = {}
        file['profileImg'] = (io.BytesIO(b"abcdef"), 'test.jpg')
        rv = client.post('/images', data=file, content_type='multipart/form-data')
        assert rv.status_code == 401
        assert b'Unauthorized' in rv.data

    def test_upload_profileImg(self, client):
        credentials = {'username': 'test_user', 'password': 'password'}
        client.post('/login', data=json.dumps(credentials), content_type='application/json')

        file = {}
        file['profileImg'] = (io.BytesIO(b"abcdef"), 'test.jpg')
        rv = client.post('/images', data=file, content_type='multipart/form-data')
        response = rv.get_json()
        assert response['statusCode'] == 3
        assert response['status'] == 'profileImg successfully saved'
        profilepicture = User.get(1).profilepicture
        assert profilepicture is not None
        assert '/images/000001_profileImg' in profilepicture

    def test_get_image(self, client):
        profilepicture = User.get(1).profilepicture
        rv = client.get(profilepicture)
        image = rv.data
        assert image == b'abcdef'
        img_handler.remove_image(profilepicture)

    def test_upload_errors(self, client):
        file = {}
        rv = client.post('/images', data=file, content_type='multipart/form-data')
        response = rv.get_json()
        assert response['statusCode'] == 1
        assert response['status'] == 'invalid upload'

        file['profileImg'] = (io.BytesIO(b"echo 'moinsen'"), 'test.sh')
        rv = client.post('/images', data=file, content_type='multipart/form-data')
        response = rv.get_json()
        assert response['statusCode'] == 2
        assert response['status'] == 'file not allowed'

        file = {}
        file['sthElse'] = (io.BytesIO(b"echo 'moinsen'"), 'test.sh')
        rv = client.post('/images', data=file, content_type='multipart/form-data')
        response = rv.get_json()
        assert response['statusCode'] == 4
        assert response['status'] == "upload 'thumbnail', 'postImg' or 'profileImg"

    def test_upload_postImg(self, client):
        """uploading a postImg is different, because of TinyMSC
        it expects a json with a location key
        """
        file = {}
        file['postImg'] = (io.BytesIO(b"abcdef"), 'test.jpg')
        rv = client.post('/images', data=file, content_type='multipart/form-data')
        response = rv.get_json()
        assert '/images/000001_postImg' in response['location']
        img_handler.remove_image(response['location'])
