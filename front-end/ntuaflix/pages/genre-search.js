import React, { useState } from 'react';
import { Box, FormControl, Select, MenuItem, TextField, Button, FormHelperText } from '@mui/material';
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
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);




  const handleSearch = async () => {
    if (!selectedGenre || !rating) {
      setFormError('Please select a genre and enter a minimum rating to search.');
      return;
    }
    setFormError('');

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
    setIsLoading(true);


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
    } finally {
      setIsLoading(false);
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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '20px'
    }}>
      {/* Search Form Container */}
      <Box sx={{
        height: 'fit-content',
        width: 'fit-content',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid var(--neutral-color)', // Adjusted for visual consistency
        boxShadow: 'var(--shadow)',
        backgroundColor: 'var(--primary-color)'
      }}>
        <FormControl sx={{
          width: 250, '& label': { color: 'var(--button-text-color)' }, // Label color
          '& label.Mui-focused': {
            color: 'var(--button-text-color)', // Color when the input is focused
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'var(--button-background-color)' }, // Default border color
            '&:hover fieldset': { borderColor: 'var(--button-background-color)' }, // Border color on hover
            '&.Mui-focused fieldset': { borderColor: 'var(--button-background-color)' }, // Border color when focused
            '& .MuiSelect-icon': { color: 'var(--secondary-color-1)' },
          },
          '& .MuiInputBase-input': { color: !selectedGenre && formError ? 'var(--accent-color-1)' : 'var(--button-text-color)' // Change color conditionally based on error
        }
        }} error={!selectedGenre && formError}>
          <Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            MenuProps={{
              sx: {
                '.MuiMenu-list': { // Targeting the list within the menu
                  paddingTop: '0px', // Remove padding at the start of the list
                  paddingBottom: '0px', // Remove padding at the end of the list
                }
              }
            }}
          >
            <MenuItem value="" disabled>Select Genre *</MenuItem>
            {genres.map(genre => (
              <MenuItem
                key={genre}
                value={genre}
                sx={{
                  color: selectedGenre === genre ? 'var(--primary-color)' : 'var(--button-text-color)', // Change text color if selected
                  backgroundColor: 'var(--secondary-color-1)', // Change background color if selected
                  '&:hover': {
                    backgroundColor: 'var(--button-hover-background-color)',
                  },
                }}
              >
                {genre}
              </MenuItem>
            ))}
          </Select>
          {!selectedGenre && <FormHelperText sx={{ color: 'var(--secondary-color-1)' }}>Required</FormHelperText>}

        </FormControl>

        <TextField
          label="Minimum Rating (0-10) *"
          type="text"
          value={rating}
          onChange={handleRatingChange}
          onFocus={(event) => event.target.select()}
          sx={{
            width: 250,
            '& label': { color: 'var(--button-text-color)' }, // Label color
            '& label.Mui-focused': {
              color: 'var(--button-text-color)', // Color when the input is focused
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: !rating && formError ? 'var(--accent-color-1)' : 'var(--button-background-color)', // Border color changes conditionally
              },
              '&:hover fieldset': { borderColor: 'var(--button-background-color)' }, // Border color on hover
              '&.Mui-focused fieldset': { borderColor: 'var(--button-background-color)' }, // Border color when focused
            },
            '& .MuiInputBase-input': {
              color: 'var(--button-text-color)' // Input text color stays the same even if error is true
            },
            '& .MuiFormHelperText-root': { color: 'var(--secondary-color-1)' }, // Helper text color
            '& .MuiFormHelperText-root.Mui-error': {
              color: !rating && formError ? 'var(--accent-color-1)' : 'var(--secondary-color-1)', // Helper text color changes conditionally
            },
          }}
          error={!rating && formError}
          helperText={!rating ? 'Required' : ''}
          FormHelperTextProps={{
            sx: {
              // Specify the error color for the helper text here
              color: (!rating && formError) ? 'var(--accent-color-1)' : 'inherit', // Only apply error color on error
            }
          }}
        />

        <TextField
          label="Start Year (optional)"
          type="text"
          value={startYear}
          onChange={handleYearChange(setStartYear)}
          onFocus={(event) => event.target.select()}
          sx={{
            width: 250, '& label': { color: 'var(--button-text-color)' }, // Label color
            '& label.Mui-focused': {
              color: 'var(--button-text-color)', // Color when the input is focused
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'var(--button-background-color)' }, // Default border color
              '&:hover fieldset': { borderColor: 'var(--button-background-color)' }, // Border color on hover
              '&.Mui-focused fieldset': { borderColor: 'var(--button-background-color)' }, // Border color when focused
            },
            '& .MuiInputBase-input': { color: 'var(--button-text-color)' }
          }}
        />

        <TextField
          label="End Year (optional)"
          type="text"
          value={endYear}
          onChange={handleYearChange(setEndYear)}
          onFocus={(event) => event.target.select()}
          sx={{
            width: 250, '& label': { color: 'var(--button-text-color)' }, // Label color
            '& label.Mui-focused': {
              color: 'var(--button-text-color)', // Color when the input is focused
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'var(--button-background-color)' }, // Default border color
              '&:hover fieldset': { borderColor: 'var(--button-background-color)' }, // Border color on hover
              '&.Mui-focused fieldset': { borderColor: 'var(--button-background-color)' }, // Border color when focused
            },
            '& .MuiInputBase-input': { color: 'var(--button-text-color)' }
          }}
        />

        <Button type="button" variant="contained" sx={{ width: 250 }} onClick={handleSearch}>
          Search
        </Button>
        {formError && (
          <Box sx={{ color: `var(--accent-color-1)`, marginTop: '10px' }}>
            {formError}
          </Box>
        )}
      </Box>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        searchPerformed && <Box  sx={{ color: `var(--primary-color)`, marginTop: '10px' }}>No movies found. Try adjusting your search criteria.</Box>
      )}
    </Box>
  );
};

export default GenreSearchPage;
