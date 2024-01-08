import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import NameGrid from '../components/NameGrid';
import Box from '@mui/material/Box';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { term, type } = router.query;

  useEffect(() => {
    if (term && type) {
      fetchSearchResults(term, type);
    }
  }, [term, type]);

  const fetchSearchResults = async (searchTerm, searchType) => {
    const tokenData = localStorage.getItem('tokenData');
    let token = null;
    if (tokenData) {
      token = JSON.parse(tokenData).token;
    }

    if (!token) {
        console.error('No token found. You are not logged in.');
        setSearchResults([]);
        return;
    }

    let endpoint;
    let payload;
    
    if (searchType === 'title') {
      endpoint = 'https://localhost:9876/ntuaflix_api/searchtitle';
      payload = { titlePart: searchTerm };
    } else if (searchType === 'name') {
      endpoint = 'https://localhost:9876/ntuaflix_api/searchname';
      payload = { namePart: searchTerm };
    } else {
      return;
    }

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
                'X-OBSERVATORY-AUTH': token
            }
        });
        setSearchResults(response.data.titleObjects || response.data.nameObjects);
        console.log(searchResults)
    } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
    }
  };


return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {searchResults.length > 0 ? (
        type === 'title' ? <MovieGrid movies={searchResults} /> : <NameGrid names={searchResults} />
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <p>No results found</p>
        </Box>
      )}
    </Box>
  );
  
};

export default SearchPage;