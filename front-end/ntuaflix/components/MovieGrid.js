// components/MovieGrid.js
import React from 'react';
import { Grid } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies }) => {
  return (
    <Grid container spacing={2}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieGrid;
