import React from 'react';
import Slider from "react-slick";
import MovieCard from './MovieCard'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";



const MovieCarousel = ({ movies }) => {
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, movies.length), // Show at most 4 slides
    slidesToScroll: Math.min(4, movies.length), // Scroll at most 4 slides
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, movies.length),
          slidesToScroll: Math.min(3, movies.length),
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, movies.length),
          slidesToScroll: Math.min(2, movies.length),
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div style={{ height: 'auto' }}> {/* Adjust the container style as needed */}
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id}> 
            <MovieCard movie={movie} />
          </div>
        ))}
      </Slider>
    </div>
  );
};


export default MovieCarousel;