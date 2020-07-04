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
          <div style={modalStyle}>
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
                  style={{ textAlign: "center" }}
                >
                  What do you want to create ?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="row ">
                    <div className="col text-center ml-5 ">
                      <Button variant="outline-success">
                        <span style={{ fontSize: "20px" }}>
                          <i
                            onClick={(path) => this.handleForwarding("/create")}
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
                        <span style={{ fontSize: "20px" }}>
                          <i
                            onClick={(path) => this.handleForwarding("/add")}
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
              <Modal.Title id="contained-modal-title-vcenter">
                You need to be logged in.
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row ">
                  <div className="col text-center ml-5 ">
                    <Button variant="dark">
                      <span style={{ fontSize: "20px" }}>
                        <i
                          onClick={(path) => this.handleForwarding("/")}
                          className="fas fa-door-open"
                          fontSize="80px"
                          style={{ fontSize: "80px" }}
                        ></i>
                        <br /> Login
                      </span>
                    </Button>
                  </div>
                  <div className="col text-center mr-5">
                    <Button variant="dark">
                      <span style={{ fontSize: "20px" }}>
                        <i
                          onClick={(path) => this.handleForwarding("/register")}
                          className="fas fa-address-card"
                          style={{ fontSize: "80px" }}
                        ></i>
                        <br />
                        Register
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
        )}
      </div>
    );
  }
}

const modalStyle = {
  borderRadius: "10%",
  backgroundColor: "black",
};

export default withRouter(CreateModal);
