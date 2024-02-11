import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Link from 'next/link';

const MovieCard = ({ movie }) => {
  const defaultImage = '/foo.jpg'; 
  const posterUrl = movie.titlePoster ? movie.titlePoster.replace('{width_variable}', 'w200') : defaultImage;

  

  return (
    <Link href={`/title/${movie.titleID}`} passHref>
      <Card className='card' style={{ cursor: 'pointer' }}> 
        <CardMedia
          className='movie-card-media'
          image={posterUrl}
          alt={`Poster of ${movie.originalTitle}`}
        />
        <CardContent className='movie-card-content'>
          <Typography gutterBottom variant="h6" component="div" className="movie-title">
            {movie.originalTitle}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
