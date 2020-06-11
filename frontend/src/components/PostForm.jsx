import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import SaveChangesModal from "./layout/SaveChangesModal";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      caption: "",
      content: null,
    };
  }
  handleEditorChange = (content, editor) => {
    this.setState({ content });
  };

  handleEditorSubmit = (event) => {
    event.preventDefault();
    alert(this.state.content);
    document.getElementById("output").innerHTML = this.state.content;
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  render() {
    return (
      <div className="container">
        <Col sm={12}>
          <h3 style={headerStyles}> {this.props.heading}</h3>
          <FormGroup as={Row}>
            <Form.Label column sm={1}>
              Caption
            </Form.Label>
            <Col sm={5}>
              <Form.Control name="caption" onChange={this.handleChange} />
            </Col>
          </FormGroup>

          <form onSubmit={this.handleEditorSubmit}>
            <div className="d-flex justify-content-end ">
              <Button
                onClick={this.handleEditorSubmit}
                variant="dark"
                type="submit"
              >
                Save
              </Button>
              <Button onClick={this.toggleModal} variant="dark">
                Toggle
              </Button>
            </div>

            <div id="output"></div>
            <SaveChangesModal
              show={this.state.showModal}
              onHide={() => this.setState({ showModal: false })}
              data={this.state.content}
              heading={"Are you sure you are done?"}
              content={
                "If you are happy with your blog entry you can press save otherwise just go back and keep on editing"
              }
            />

            <Editor
              apiKey="ykdvtcb9mmz6dfe2dnupk22gz7or7ygc59unyeye0x1yr9g8"
              id="uuid"
              outputFormat="html"
              initialValue="<h3>Tell your story now...🏕</h3>"
              onEditorChange={this.handleEditorChange}
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
                file_picker_callback: function (cb, value, meta) {
                  var input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/png , image/jpg");

                  input.onchange = function () {
                    var file = this.files[0];

                    var reader = new FileReader();
                    reader.onload = function () {
                      var id = "blobid" + new Date().getTime();
                      var blobCache =
                        window.tinymce.activeEditor.editorUpload.blobCache;
                      var base64 = reader.result.split(",")[1];
                      var blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      /* call the callback and populate the Title field with the file name */
                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                    console.log(file);
                  };

                  input.click();
                },
              }}
            />
          </form>
        </Col>
      </div>
    );
  }
}

const headerStyles = {
  fontFamily: "Libre Baskerville , serif",
  margin: "35px 0px",
};

export default PostForm;
