import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class SaveChangesModal extends Component {
  render() {
    return (
      <div>
        <Modal
          {...this.props}
          open={this.props.open}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.heading}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.props.content}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Back
          </Button>
            <Button variant="dark" onClick={this.props.onSubmit}>
              Save changes
          </Button>
          </Modal.Footer>
        </Modal>

      </div>

    );
  }
}
export default SaveChangesModal;
