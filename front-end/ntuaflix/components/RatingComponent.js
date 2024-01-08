// components/RatingComponent.js
import React from 'react';
import Rating from '@mui/lab/Rating';
import Typography from '@mui/material/Typography';

const RatingComponent = ({ value, onChange }) => {
    return (
        <div>
            <Typography component="legend">Rating</Typography>
            <Rating
                name="movie-rating"
                value={value}
                onChange={(event, newValue) => {
                    onChange(newValue);
                }}
            />
        </div>
    );
};

export default RatingComponent;
