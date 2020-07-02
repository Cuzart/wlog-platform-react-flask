import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Image from "react-bootstrap/Image";
class TripImage extends Component {
  render() {
    return (
      <div
        className="thumbnail_container"
        position="relative"
        onClick={() => this.props.history.push("/trips/" + this.props.tripId)}
      >
        <div className="thumbnail_title">{this.props.title}</div>
        <Image
          rounded
          className="thumbnail"
          alt=""
          src={this.props.thumbnailUrl}
        />
        <div className="thumbnail_overlay">{this.props.description}</div>
      </div>
    );
  }
}

export default withRouter(TripImage);
