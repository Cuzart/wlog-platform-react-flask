import React, { Component } from "react";
import Image from 'react-bootstrap/Image'
class TripImage extends Component {
  render() {
    return (
      <div className="thumbnail_container" position="relative">
        <div className="thumbnail_title">{this.props.title}</div>
        <Image
        rounded
          onClick={this.handleChange}
          className="thumbnail"
          alt={this.props.title}
          src={this.props.thumbnailUrl}
        />
        <div className="thumbnail_overlay">{this.props.description}</div>
      </div>
    );
  }
}

export default TripImage;
