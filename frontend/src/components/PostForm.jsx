import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../App.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

class PostForm extends Component {

  render() {
    return (
      <div className="container">
        <Form>
          <Col >
            <h3 style={headerStyles}> {this.props.heading}</h3>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Caption
              </Form.Label>
              <Col sm={5}>
                <Form.Control name="caption" onChange={this.props.handleChange} />
              </Col>
            </FormGroup>
            <FormGroup as={Row}>
              <Form.Label column sm={1}>
                Location
              </Form.Label>
              <Col sm={5}>
                <Form.Control name="location" onChange={this.props.handleChange} onBlur={this.props.handleLocationApi}/>
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

            <div style={paddingStyle}>
              <Editor
                apiKey="ykdvtcb9mmz6dfe2dnupk22gz7or7ygc59unyeye0x1yr9g8"
                id="uuid"
                outputFormat="html"
                initialValue="<h3>Tell your story now...🏕</h3>"
                onEditorChange={this.props.handleEditorChange}
                init={{
                  automatic_uploads: false,
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist lists link image imagetools charmap print preview  help",
                    "searchreplace visualblocks emoticons autoresize autosave",
                    "insertdatetime media table paste wordcount fullscreen",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image  link table forecolor backcolor charmap emoticons | save restoredraft help fullscreen",

                  contextmenu_never_use_native: true,
                  statusbar: false,
                  branding: false,
                  link_context_toolbar: true,
                  autosave_ask_before_unload: false,
                  autosave_interval: "60s",
                  image_title: true,
                  file_picker_types: "image video",
                  //images_upload_url: 'postAcceptor.php',
                  //images_upload_base_path: '/blog/images',

                  // file picker
                  images_upload_handler: function (blobInfo, success, failure) {
                    var xhr, formData;
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', 'postAcceptor.php');
                    xhr.onload = function () {
                      var json;

                      if (xhr.status !== 200) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                      }
                      json = JSON.parse(xhr.responseText);

                      if (!json || typeof json.location !== 'string') {
                        failure('Invalid JSON: ' + xhr.responseText);
                        return;
                      }
                      success(json.location);
                    };
                    formData = new FormData();
                    formData.append('gallery', window.event.target.files[0]);
                    xhr.send(formData);
                  }
           
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
  fontFamily: "Libre Baskerville , serif",
  margin: "35px 0px",
  
};

const paddingStyle = {
  padding: "40px 0px"
};

export default PostForm;
