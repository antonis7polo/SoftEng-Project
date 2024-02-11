import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, Typography, Box, useTheme, useMediaQuery, Rating, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const MovieDetail = ({ movie }) => {
    const [userRating, setUserRating] = useState(null);
    const [showRecommendationButton, setShowRecommendationButton] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const router = useRouter();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { titleObject } = movie;
    const genres = titleObject.genres.map(g => g.genreTitle).join(', ');
    const akas = titleObject.titleAkas.map(aka => `${aka.akaTitle}${aka.regionAbbrev ? ` (${aka.regionAbbrev})` : ''}`).join(', ');
    const [averageRating, setAverageRating] = useState(movie.titleObject.rating.avRating);
    const [numberOfVotes, setNumberOfVotes] = useState(movie.titleObject.rating.nVotes);

    useEffect(() => {
        const fetchUserRatings = async () => {
            // Retrieve token data from localStorage
            const tokenData = localStorage.getItem('tokenData');
            const { token, userID } = JSON.parse(tokenData);

            try {
                const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                const response = await axios.get(`https://localhost:9876/ntuaflix_api/ratings/${userID}`, config);
                const ratingsData = response.data.ratings; // Access the ratings array
                const movieRating = ratingsData.find(r => r.title_id === titleObject.titleID);
                if (movieRating) {
                    setUserRating(parseFloat(movieRating.user_rating)); // Convert string to number
                } else {
                    setUserRating(0); // Set default rating if not found
                }
            } catch (error) {
                console.error('Error fetching user ratings:', error);
            }
        };


        fetchUserRatings();

    }, [titleObject.titleID]);

    useEffect(() => {
        setShowRecommendationButton(userRating >= 7);
    }, [userRating]);

    const fetchTitleDetails = async () => {
        const tokenData = localStorage.getItem('tokenData');
        const { token } = JSON.parse(tokenData);
        const config = { headers: { 'X-OBSERVATORY-AUTH': token } };

        try {
            const response = await axios.get(`https://localhost:9876/ntuaflix_api/titles/${titleObject.titleID}/details`, config);
            return response.data.titleDetails;
        } catch (error) {
            console.error('Error fetching title details:', error);
        }
    };

    useEffect(() => {
        if (userRating >= 7) {
            fetchAndSetRecommendations();
        } else {
            setShowRecommendationButton(false);
        }
    }, [userRating]);

    const fetchAndSetRecommendations = async () => {
        const titleDetails = await fetchTitleDetails();
        if (titleDetails) {
            setShowRecommendationButton(true);
            // Assuming titleDetails contains genres, actors, and director
            const queryData = {
                titleID: titleObject.titleID,
                genres: titleDetails.genres.map(g => g.genreTitle).join(', '),
                actors: titleDetails.leadActors.map(a => a.nameID).join(', '),
                director: titleDetails.directors.length ? titleDetails.directors[0].nameID : null
            };
            setRecommendations(queryData);
        }
    };

    const handleRatingChange = async (newValue) => {
        const tokenData = localStorage.getItem('tokenData');
        if (tokenData) {
            const { token, userID } = JSON.parse(tokenData);
            const config = { headers: { 'X-OBSERVATORY-AUTH': token } };


            try {
                if (newValue > 0) {
                    // Update the rating
                    await axios.post(`https://localhost:9876/ntuaflix_api/uploadrating`, {
                        userID,
                        titleID: titleObject.titleID,
                        userRating: newValue
                    }, config);
                } else {
                    // Delete the rating
                    await axios.delete(`https://localhost:9876/ntuaflix_api/ratings/${userID}/${titleObject.titleID}`, config);
                }
                setUserRating(newValue);
                setShowRecommendationButton(newValue >= 7);

                const response = await axios.get(`https://localhost:9876/ntuaflix_api/title/${titleObject.titleID}`, config);
                if (response.status === 200) {
                    setAverageRating(response.data.titleObject.rating.avRating);
                    setNumberOfVotes(response.data.titleObject.rating.nVotes);
                }

            } catch (error) {
                console.error('Error updating rating:', error);
            }



        }
    };


    const goToRecommendations = () => {
        if (recommendations) {
            router.push({
                pathname: '/recommendations',
                query: {
                    ...recommendations,
                    currentTitleId: titleObject.titleID
                }

            });
        }
    };






    // Adjust poster size based on screen width
    const posterSize = isSmallScreen ? 'w200' : 'w500';
    const defaultImage = '/foo.jpg'; // Default image path
    const posterUrl = titleObject.titlePoster ? titleObject.titlePoster.replace('{width_variable}', posterSize) : defaultImage;

    // Create a link for each principal
    const createPrincipalLink = (principal) => (
        <Link href={`/name/${principal.nameID}`} key={principal.nameID} passHref>
            <span style={{ color: 'inherit', textDecoration: 'underline' }}>
                {principal.name}
            </span>
        </Link>
    );
    

    // Group principals by categories
    const principalCategories = titleObject.principals.reduce((acc, principal) => {
        const categoryKey = principal.category.toLowerCase() === 'actress' ? 'actors' : `${principal.category}s`;
        if (!acc[categoryKey]) {
            acc[categoryKey] = [];
        }
        acc[categoryKey].push(createPrincipalLink(principal));
        return acc;
    }, {});

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto', p: theme.spacing(2), display: 'flex', justifyContent: 'center' }}>
            <Card className="movie-card" sx={{
                maxWidth: '80%',
                boxShadow: 'var(--shadow)',
                borderRadius: 'var(--border-radius)',
                margin: 'auto',
                overflow: 'hidden',
                maxHeight: '80%'
            }}>
                <Box component="img" src={posterUrl} alt={titleObject.originalTitle} sx={{ width: '100%', display: 'block', height: '500px' }} />
                <CardContent sx={{ padding: theme.spacing(3) }}>
                    <Typography gutterBottom variant={isSmallScreen ? 'h6' : 'h5'} component="div" sx={{
                        color: 'var(--background-color)',
                        fontFamily: 'var(--font-sans)'
                    }}>
                        {titleObject.originalTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--background-color)', fontFamily: 'var(--font-sans)' }}>
                        Year: {titleObject.startYear}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--background-color)', fontFamily: 'var(--font-sans)' }}>
                        Genres: {genres}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--background-color)', fontFamily: 'var(--font-sans)' }}>
                        Alternate Titles: {akas}
                    </Typography>
                    {Object.entries(principalCategories).map(([category, names]) => (
                        <Typography key={category} variant="body2" sx={{ color: 'var(--background-color)', fontFamily: 'var(--font-sans)' }}>
                            {`${category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}: `}
                            {names.reduce((prev, curr) => [prev, ', ', curr])}
                        </Typography>
                    ))}
                    <Typography variant="body2" sx={{ color: 'var(--background-color)', fontFamily: 'var(--font-sans)' }}>
                        {averageRating > 0 ? `Average Rating: ${averageRating} (${numberOfVotes} votes)` : 'Average Rating: N/A (0 votes)'}
                    </Typography>
                    <Rating
                        name="user-rating"
                        value={userRating || 0}
                        onChange={(event, newValue) => handleRatingChange(newValue)}
                        max={10}
                        precision={1}
                        size={isSmallScreen ? 'small' : 'medium'}
                        sx={{
                            color: 'var(--secondary-color-2)', // Active star color
                            '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
                                color: 'var(--background-color)', // Color for empty stars (outline)
                            }
                        }}
                    />
                    {showRecommendationButton && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="contained" onClick={goToRecommendations} sx={{
                                boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.5)' // Custom shadow for more intensity
                            }}>
                                Watch Similar
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default MovieDetail;
