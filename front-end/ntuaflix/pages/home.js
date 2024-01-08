import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCarousel from '../components/MovieCarousel';
import { Box } from '@mui/material';

const HomePage = () => {
    const [categories, setCategories] = useState({});
  
    useEffect(() => {
        const fetchCategories = async () => {
            // Retrieve token data from localStorage
            const tokenData = localStorage.getItem('tokenData');
            let token = null;
            if (tokenData) {
                token = JSON.parse(tokenData).token;
            }

            try {
                const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                const { data } = await axios.get('https://localhost:9876/ntuaflix_api/home', config);
                const categoriesData = data.data;

                // Fetch details for each movie
                for (const category in categoriesData) {
                    categoriesData[category] = await Promise.all(
                        categoriesData[category].map(async (item) => {
                            const detailResponse = await axios.get(`https://localhost:9876/ntuaflix_api/title/${item.titleID}`, config);
                            return detailResponse.data.titleObject; 
                        })
                    );
                }

                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
  
        fetchCategories();
    }, []);

    const categoryRenameMapping = {
        topRatedMovies: 'Top Movies',
        topRatedTvShows: 'Top TV Series',
        newReleases: 'New Releases',
        popularInAction: 'Action Movies',
        popularInComedy: 'Comedy Movies',
        popularInDrama: 'Drama Movies',
        popularInRomance: 'Romantic Movies',
        popularInThriller: 'Thriller Movies',
        popularInHorror: 'Horror Movies',
        popularInDocumentary: 'Documentaries',
        popularInAdventure: 'Adventure Movies',
        // Add more mappings as necessary
    };
    
    function renameCategory(originalCategoryName) {
        return categoryRenameMapping[originalCategoryName] || originalCategoryName;
    }
    
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
        {Object.entries(categories).map(([categoryName, movies]) => (
            <Box key={categoryName} sx={{ marginBottom: 4 }}>
                <h2 className="category-heading">{renameCategory(categoryName)}</h2>
                <MovieCarousel movies={movies} />
            </Box>
        ))}
    </Box>
);
};
  
export default HomePage;
