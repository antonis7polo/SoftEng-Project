import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Link, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';

const NameDetail = ({ nameDetails }) => {
    const [movieTitles, setMovieTitles] = useState({});
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const defaultImage = '/foo.jpg';
    const posterSize = isSmallScreen ? 'w200' : 'w500';
    const posterUrl = nameDetails.namePoster ? nameDetails.namePoster.replace('{width_variable}', posterSize) : defaultImage;

    useEffect(() => {
        if (nameDetails?.nameTitles) {
            const fetchMovieTitles = async () => {
                const tokenData = localStorage.getItem('tokenData');
                let token = null;
                if (tokenData) {
                    token = JSON.parse(tokenData).token;
                }
                const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                const promises = nameDetails.nameTitles.map(title => 
                    axios.get(`https://localhost:9876/ntuaflix_api/title/${title.titleID}`, config)
                        .then(response => ({ [title.titleID]: response.data.titleObject.originalTitle }))
                        .catch(error => console.error('Error fetching movie title:', error))
                );
                const movies = await Promise.all(promises);
                const titlesMap = movies.reduce((acc, titleObj) => ({ ...acc, ...titleObj }), {});
                setMovieTitles(titlesMap);
            };

            fetchMovieTitles();
        }
    }, [nameDetails]);

    if (!nameDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ maxWidth: '1000px', mx: 'auto', p: theme.spacing(2), display: 'flex', justifyContent: 'center' }}>
            <Card className="movie-card" sx={{
                maxWidth: '100%',
                boxShadow: 'var(--shadow)',
                borderRadius: 'var(--border-radius)',
                margin: 'auto',
                overflow: 'hidden'
            }}>
                <Box component="img" src={posterUrl} alt={`Portrait of ${nameDetails.name}`} sx={{ width: '100%', display: 'block', height: '500px' }} />
                <CardContent sx={{ padding: theme.spacing(3) }}>
                    <Typography gutterBottom variant={isSmallScreen ? 'h6' : 'h5'} component="div" sx={{
                        color: 'rgb(var(--secondary-color-2))',
                        fontFamily: 'var(--font-sans)'
                    }}>
                        {nameDetails.name}
                    </Typography>
                    {nameDetails.birthYr && (
                    <Typography variant="body2" sx={{ color: 'rgb(var(--neutral-color))', fontFamily: 'var(--font-sans)' }}>
                        Birth Year: {nameDetails.birthYr}
                    </Typography>
                    )}
                    {nameDetails.deathYr && (
                        <Typography variant="body2" sx={{ color: 'rgb(var(--neutral-color))', fontFamily: 'var(--font-sans)' }}>
                            Death Year: {nameDetails.deathYr}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'rgb(var(--neutral-color))', fontFamily: 'var(--font-sans)' }}>
                        Professions: {nameDetails.profession.split(',').join(', ')}
                    </Typography>
                    {nameDetails.nameTitles && (
                       <Typography variant="body2" sx={{ color: 'rgb(var(--neutral-color))', fontFamily: 'var(--font-sans)' }}>
                       Titles:
                       {nameDetails.nameTitles.map((title, index) => (
                           <React.Fragment key={title.titleID}>
                               {index > 0 && ', '}
                               <Link href={`/title/${title.titleID}`} color="inherit">
                                   {movieTitles[title.titleID] || title.titleID}
                               </Link>
                           </React.Fragment>
                       ))}
                     </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default NameDetail;
