// components/NameGrid.js
import React from 'react';
import { Grid } from '@mui/material';
import NameCard from './NameCard';

const NameGrid = ({ names }) => {
  return (
    <Grid container spacing={2}>
      {names.map((name) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={name.nameID}>
          <NameCard name={name} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NameGrid;
