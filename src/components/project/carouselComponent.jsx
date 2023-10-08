import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import agile from '../../data/img/agile.png';
import dbscan from '../../data/img/dbscan.jpg';
import anime from '../../data/img/anime.png';

class CarouselComponent extends Component {

  render() {
    return (
      <Carousel>
        <Carousel.Item interval={1000}>
          <img
            className="d-block w-100"
            src={agile}
            alt="Delivery app"
          />
        </Carousel.Item>
        <Carousel.Item interval={1000}>
          <img
            className="d-block w-100"
            src={dbscan}
            alt="Clustering Lyon"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={anime}
            alt="Main screen of Anime app"
          />
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default CarouselComponent;