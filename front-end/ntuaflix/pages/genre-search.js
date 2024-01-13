import React, { useState } from 'react';
import { Box, FormControl, Select, MenuItem, TextField, Button } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import axios from 'axios';

const genres = [
  'Action', 'Adult', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 
  'Musical', 'Mystery', 'News', 'Romance', 'Sci-Fi', 'Short', 'Sport', 
  'Thriller', 'War', 'Western'
];

const currentYear = new Date().getFullYear(); 

const GenreSearchPage = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [rating, setRating] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false); 


  const handleSearch = async () => {
    setSearchPerformed(true);
    const tokenData = localStorage.getItem('tokenData');
    let token = null;
    if (tokenData) {
      token = JSON.parse(tokenData).token;
    }

    const requestBody = {
        qgenre: selectedGenre,
        minrating: rating
      };
    
      // Only add start and end year to the request body if they are provided
      if (startYear) requestBody.yrFrom = startYear;
      if (endYear) requestBody.yrTo = endYear;
    
      try {
        const response = await axios.post('https://localhost:9876/ntuaflix_api/bygenre', requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'X-OBSERVATORY-AUTH': token
          }
        });
    
        setMovies(response.data.titleObjects || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };

  const handleRatingChange = (event) => {
    const value = event.target.value;
    setRating(value === '' ? '' : String(Number(value)));
  };

  const handleYearChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === '' ? '' : String(Number(value)));
  };

  return (
    <Box sx={{ margin: '20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <FormControl sx={{ width: 250 }}> {/* Adjusted width */}
        <Select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" disabled>Select Genre</MenuItem>
          {genres.map(genre => (
            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Minimum Rating (0-10)"
        type="text" // Change to text to allow empty strings
        value={rating}
        onChange={handleRatingChange}
        onFocus={(event) => event.target.select()} // Select all text on focus
        sx={{ width: 250 }}
      />

      <TextField
        label="Start Year (1900-Current Year)"
        type="text"
        value={startYear}
        onChange={handleYearChange(setStartYear)}
        onFocus={(event) => event.target.select()}
        sx={{ width: 250 }}
      />

      <TextField
        label="End Year (1900-Current Year)"
        type="text"
        value={endYear}
        onChange={handleYearChange(setEndYear)}
        onFocus={(event) => event.target.select()}
        sx={{ width: 250 }}
      />
      
      <Button type="button" variant="contained" sx={{ width: 250 }} onClick={handleSearch}>
        Search
      </Button>
      {movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        searchPerformed && <Box>No movies found. Try adjusting your search criteria.</Box>
      )}
    </Box>
  );
};

export default GenreSearchPage;
