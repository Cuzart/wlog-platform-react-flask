import React, { Component } from "react";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import PostForm from "../PostForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SaveChangesModal from "../layout/SaveChangesModal";
import Button from "react-bootstrap/Button";
import axios from "axios";

export class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caption: "",
            content: null,
            location: "",
            locationObject: { label: "" }, 
            showModal: false,
        };
    }
   
    // If editor is changed
    handleEditorChange = (content, editor) => {
        this.setState({ content });
    };
    // Updates state when form is changed
    handleChange = (event) => {
        let nam = window.event.target.name;
        let val = window.event.target.value;
        this.setState({ [nam]: val });
    };

    // leaflet-geosearch asynchronous API call to get a result{x: longitude, y: latitude, label: adress}
    handleLocationApi = async (event) => {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ 'query': this.state.location });
        if (results.length > 0) {
            this.setState({ locationObject: results[0] })
        }
    }

    // File Upload as Form Data to DB
    handleFileUpload = (event) => {
        const fd = new FormData();
        fd.append("thumbnail", this.state.thumbnail);
        axios.post("/upload", fd).then((res) => {
            console.log(res);
        });
        // uploads whole state JSON 
        axios.post("/tripUpload", this.state).then((res) => {
          console.log(res);
        })
    };

    //Submitting the Form
    handleSubmit = (event) => {
        this.setState({ showModal: false });
        //this.handleFileUpload()
        console.log(this.state.locationObject);
    };
    // Shows modal on submit
    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    };

    render() {
        return (
            <div as={Row} className="container" style={formStyle}>
                <Col>
                    <PostForm
                        heading="Add a blog entry"
                        handleChange={this.handleChange}
                        handleEditorChange={this.handleEditorChange}
                        handleLocationApi={this.handleLocationApi}
                        locationObject={this.state.locationObject}
                    />
                    <div style={btnLayout}>
                        <Button variant="dark" type="submit" onClick={this.toggleModal} size="lg">
                            Done
          </Button>
                    </div>
                </Col>
                <div>
                    <SaveChangesModal
                        show={this.state.showModal}
                        onHide={() => this.setState({ showModal: false })}
                        onSubmit={() => this.handleSubmit()}
                        heading={"Are you sure you are done?"}
                        content={
                            "If you are happy with your blog entry you can press save otherwise just go back and keep on editing"
                        }
                    />
                </div>
            </div>
        );
    }
}
const formStyle = {
    paddingBottom: "100px",
    paddingTop: "50px",
};

const btnLayout = {
    marginTop: "50px",
    textAlign: "right",
    padding: "0px 90px"
}

export default CreatePost;
