import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import MovieCarousel from '../components/MovieCarousel';
import { Box } from '@mui/material';

const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState({});
    const [nameMapping, setNameMapping] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchName = async (nameId) => {
            const tokenData = localStorage.getItem('tokenData');
            let token = null;
            if (tokenData) {
                token = JSON.parse(tokenData).token;
            }

            try {
                const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                const response = await axios.get(`https://localhost:9876/ntuaflix_api/name/${nameId}`, config);
                return response.data.nameObject.name;
            } catch (error) {
                console.error('Error fetching name:', error);
                return nameId; // Fallback to the ID if there's an error
            }
        };

        const updateNameMapping = async (category) => {
            const nameId = category.split(' ')[1];
            if (!nameId || nameMapping[nameId]) {
                return;
            }
            const realName = await fetchName(nameId);
            setNameMapping(prev => ({ ...prev, [nameId]: realName }));
        };

        Object.keys(recommendations).forEach(updateNameMapping);
    }, [recommendations, nameMapping]);


    useEffect(() => {

        const fetchRecommendations = async () => {
            // Extracting query parameters
            const { genres, actors, director, currentTitleId } = router.query;

            // Preparing the request body
            const requestBody = {
                genres: genres ? genres.split(',') : [],
                actors: actors ? actors.split(',') : [],
                director: director || null
            };

            const tokenData = localStorage.getItem('tokenData');
            let token = null;
            if (tokenData) {
                token = JSON.parse(tokenData).token;
            }


            try {
                const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                const response = await axios.post('https://localhost:9876/ntuaflix_api/recommendations', requestBody, config);
                const filteredRecommendations = Object.fromEntries(
                    Object.entries(response.data).map(([category, movies]) => [
                        category,
                        movies.filter(movie => movie.title_id !== currentTitleId)
                    ])
                );
                setRecommendations(filteredRecommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setRecommendations({});
            }
        };

        if (router.isReady) {
            fetchRecommendations();
        }
    }, [router.isReady, router.query]);




    return (
        <Box sx={{ padding: 4 }}>
            <h2 className="category-heading"> You may also like </h2>
            {Object.entries(recommendations).map(([category, movies]) => (
                movies.length > 0 && (
                    <Box key={category} sx={{ mb: 4 }}>
                        <MovieCarousel movies={movies.map(movie => ({
                            titleID: movie.title_id,
                            originalTitle: movie.original_title,
                            titlePoster: movie.image_url_poster ? movie.image_url_poster.replace('{width_variable}', 'w200') : null
                        }))} />
                    </Box>
                )
            ))}
        </Box>
    );
};


export default RecommendationsPage;