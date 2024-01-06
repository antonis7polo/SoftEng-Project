// components/SearchBar.js
import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const SearchBar = ({ onSearch }) => {
    return (
        <TextField
            fullWidth
            label="Search Movies"
            variant="outlined"
            onChange={(e) => onSearch(e.target.value)}
            sx={{
                '& label.Mui-focused': {
                    color: 'rgb(var(--secondary-color-1))',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgb(var(--neutral-color))',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgb(var(--secondary-color-1))',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgb(var(--secondary-color-1))',
                    },
                },
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon sx={{ color: 'rgb(var(--secondary-color-1))' }} />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBar;
