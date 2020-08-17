import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../App.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormGroup from 'react-bootstrap/FormGroup';

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        caption: '',
        location: '',
      },
      postErrors: {
        captionError: '',
        locationError: '',
      },
    };
  }

  // validate form input length > 0
  validateInput = () => {
    let nam = window.event.target.name;
    let val = window.event.target.value;
    const data = { ...this.state.data, [nam]: val };
    this.setState(() => ({ data }));
    let postErrors = this.state.postErrors;
    switch (nam) {
      case 'caption':
        postErrors.captionError = val.length > 0 ? '' : 'required';
        break;
      case 'location':
        postErrors.locationError = val.length > 0 ? '' : 'required';
        break;
      default:
        break;
    }
  };
  render() {
    const { postErrors } = this.state;
    return (
      <div className='container'>
        <Form>
          <Col>
            <h3 style={headerStyles}> {this.props.heading}</h3>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Caption
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  className={postErrors.captionError.length > 0 ? 'error' : null}
                  name='caption'
                  onChange={(event) => {
                    this.props.handleChange(event);
                    this.validateInput();
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Location
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  className={postErrors.locationError.length > 0 ? 'error' : null}
                  name='location'
                  onChange={(event) => {
                    this.props.handleChange(event);
                    this.validateInput();
                  }}
                  onBlur={this.props.handleLocationApi}
                />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Logging
              </Form.Label>
              <Col sm={5}>
                <Form.Control readOnly defaultValue={this.props.locationObject.label} />
              </Col>
            </FormGroup>
            {this.props.trips ? (
              <FormGroup as={Row}>
                <Form.Label column sm={1}>
                  Add to
                </Form.Label>
                <Col sm={5}>
                  <Form.Control
                    as='select'
                    name='tripId'
                    onChange={this.props.handleChange}
                    required
                  >
                    {this.props.trips.map((trip) => {
                      return (
                        <option key={trip.id} value={trip.id}>
                          {trip.title}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Col>
              </FormGroup>
            ) : (
              ''
            )}

            <div className="py-4">
              <Editor
                apiKey='ykdvtcb9mmz6dfe2dnupk22gz7or7ygc59unyeye0x1yr9g8'
                id='tinymce-editor'
                outputFormat='html'
                initialValue='<h3>Tell your story now...</h3>'
                onEditorChange={this.props.handleEditorChange}
                init={{
                  automatic_uploads: false,
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist lists link image imagetools charmap print preview  help',
                    'searchreplace visualblocks autoresize autosave',
                    'insertdatetime media table paste wordcount fullscreen',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image  link table forecolor backcolor | save restoredraft help fullscreen',

                  contextmenu_never_use_native: true,
                  statusbar: false,
                  branding: false,
                  link_context_toolbar: true,
                  autosave_ask_before_unload: false,
                  autosave_interval: '60s',
                  image_title: true,
                  file_picker_types: 'image',
                  convert_urls: false,

                  // gets called when uploadImages() is called for activeEditor
                  // request sends formdata for each image 
                  images_upload_handler: 
                  function (blobInfo, success, failure) {
                    var xhr, formData;

                    // create XML HTTP Request
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', '/images');

                    // handles errors
                    xhr.onload = function () {
                      var json;

                      if (xhr.status < 200 || xhr.status >= 300) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                      }

                      json = JSON.parse(xhr.responseText);

                      if (!json || typeof json.location != 'string') {
                        failure('Invalid JSON: ' + xhr.responseText);
                        return;
                      }
                      success(json.location);
                    };

                    // append img to form data and send it
                    formData = new FormData();
                    formData.append('postImg', blobInfo.blob(), blobInfo.filename());

                    xhr.send(formData);
                  },
                }}
              />
            </div>
          </Col>
        </Form>
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: 'Libre Baskerville , serif',
  margin: '35px 0px',
};

export default PostForm;
