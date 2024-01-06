import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
const dotenv = require('dotenv');
dotenv.config();


const MovieCard = ({ movie }) => {
    console.log(movie); // Add this line to log the movie details

  // Provide a default image if titlePoster is null or doesn't include the width variable
  const defaultImage = "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
  const posterUrl = movie.titlePoster ? movie.titlePoster.replace('{width_variable}', 'w200') : defaultImage;

  return (
    <Card className="card"> 
      {movie.titlePoster && (
        <CardMedia
          component="img"
          height="350" // Adjust the height as needed
          image={posterUrl}
          alt={`Poster of ${movie.originalTitle}`}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {movie.originalTitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
