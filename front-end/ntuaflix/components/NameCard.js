import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Link from 'next/link';

const NameCard = ({ name }) => {
  const defaultImage = '/foo.jpg'; // Default image path
  const posterUrl = name.namePoster ? name.namePoster.replace('{width_variable}', 'w200') : defaultImage;

  

  return (
    <Link href={`/name/${name.nameID}`} passHref>
      <Card className="card" style={{ cursor: 'pointer' }}> 
        <CardMedia
          className="movie-card-media"
          image={posterUrl}
          alt={`Image of ${name.name}`} 
        />
        <CardContent className="movie-card-content">
          <Typography gutterBottom variant="h6" component="div" className="movie-title">
            {name.name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NameCard;
