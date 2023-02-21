import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

class CarouselComponent extends Component {
  state = {}

  render() {
    return (
      <Carousel>
        <Carousel.Item interval={1000}>
          <img
            className="d-block w-50 h-50"
            src="/img/agile.png"
            alt="Delivery app"
          />
        </Carousel.Item>
        <Carousel.Item interval={1000}>
          <img
            className="d-block w-50 h-50"
            src="/img/dbscan.jpg"
            alt="Clustering Lyon"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-50 h-50"
            src="/img/anime.png"
            alt="Main screen of Anime app"
          />
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default CarouselComponent;