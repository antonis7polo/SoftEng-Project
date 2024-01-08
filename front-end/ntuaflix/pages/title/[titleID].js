import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import MovieDetail from '../../components/MovieDetail'; // Adjust the path as necessary

const MovieDetailsPage = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const router = useRouter();
    const { titleID } = router.query;

    useEffect(() => {
        if (titleID) {
            const fetchMovieDetails = async () => {
                // Retrieve token data from localStorage
                const tokenData = localStorage.getItem('tokenData');
                let token = null;
                if (tokenData) {
                    token = JSON.parse(tokenData).token;
                }

                try {
                    const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                    const response = await axios.get(`https://localhost:9876/ntuaflix_api/title/${titleID}`, config);
                    setMovieDetails(response.data);
                } catch (error) {
                    console.error('Error fetching movie details:', error);
                }
            };

            fetchMovieDetails();
        }
    }, [titleID]);

    if (!movieDetails) {
        return <div>Loading...</div>; // or any other loading state representation
    }

    return (
        <div>
            <MovieDetail movie={movieDetails} />
        </div>
    );
};

export default MovieDetailsPage;
