import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";

class CreateModal extends Component {
  handleForwarding(path) {
    this.props.history.push(path);
    this.props.onHide();
  }

  render() {
    return (
      <div>
        {sessionStorage.getItem("authenticated") ? (
          <div>
            <Modal
              {...this.props}
              open={this.props.open}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="contained-modal-title-vcenter"
                  style={titleStyle}
                >
                  What do you want to create ?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="row ">
                    <div className="col text-center ml-5 ">
                      <Button variant="outline-success">
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                          <i
                            onClick={() => this.handleForwarding("/create")}
                            className="fas fa-plus-circle"
                            fontSize="80px"
                            style={{ fontSize: "80px" }}
                          ></i>
                          <br /> new trip
                        </span>
                      </Button>
                    </div>
                    <div className="col text-center mr-5">
                      <Button variant="outline-success">
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                          <i
                            onClick={() => this.handleForwarding("/add")}
                            className="fas fa-book-open"
                            style={{ fontSize: "80px" }}
                          ></i>
                          <br />
                          blog entry
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.props.onHide}>
                  Back
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <Modal
            {...this.props}
            open={this.props.open}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title
                id="contained-modal-title-vcenter"
                style={titleStyle}
              >
                Login required
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row ">
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {" "}
                    Please <a href="/">sign in</a> if you already have an
                    account <br />
                    or join our community and{" "}
                    <a href="/register">register now</a>.
                  </p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.props.onHide}>
                Back
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
}

const titleStyle = {
  fontSize: "20px",
  fontWeight: "bold",
};

export default withRouter(CreateModal);
