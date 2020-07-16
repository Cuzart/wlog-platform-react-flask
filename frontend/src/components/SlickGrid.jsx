import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import uuid from 'uuid';
import TripImage from './TripImage';
import Spinner from './Spinner';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../App.css';

export class SlickGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripData: [],
      isLoading: true,
      arrLength: 0,
    };
  }

  // fetch 20 last trips
  getTripData() {
    axios
      .get('/trips')
      .then((res) => {
        this.setState({
          tripData: res.data,
          isLoading: false,
          arrLength: res.data.length,
        });
      })
      .catch(() => this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.getTripData();
  }

  render() {
    const settings = {
      dots: true,
      speed: 500,
      arrows: true,
      slidesToShow: 2,
      centerMode: true,
      rtl: true,
    };
    return (
      <div>
        {!this.state.isLoading ? (
          <Slider {...settings}>
            {this.state.tripData.map((trip) => {
              const { id, title, description, thumbnail, country } = trip;
              return (
                <div key={uuid.v4()} onClick={() => this.props.history.push('/trips/' + id)}>
                  <TripImage
                    title={title}
                    description={description}
                    thumbnailUrl={thumbnail}
                    country={country}
                    tripId={id}
                  />
                </div>
              );
            })}
          </Slider>
        ) : (
          <Spinner />
        )}
        {/* styles the slick arrow buttons */}
        <style>
          {`
            .slick-prev:before,
            .slick-next:before {
            color: black;
            }
        `}
        </style>
      </div>
    );
  }
}

export default withRouter(SlickGrid);
