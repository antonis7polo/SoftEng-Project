// components/MovieDetail.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const MovieDetail = ({ movie }) => {
    return (
        <Card sx={{ maxWidth: 345, boxShadow: 'var(--shadow)', borderRadius: 'var(--border-radius)' }}>
            <CardMedia
                component="img"
                height="140"
                image={movie.poster} // Replace with actual image path
                alt={movie.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'rgb(var(--primary-color))' }}>
                    {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: 'rgb(var(--neutral-color))' }}>
                    {movie.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MovieDetail;
