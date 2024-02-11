// pages/index.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import { Box, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { setIsLoggedIn, saveToken } = useAuth(); // Retrieve saveToken from the context

    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async ({ username, password }) => {
        try {
            const response = await axios.post('https://localhost:9876/ntuaflix_api/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (response.data) {
                saveToken(response.data.token, response.data.userID); 
                setIsLoggedIn(true); 
                router.push('/home');
            } else {
                setError('Login failed, please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login.');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" sx={{ backgroundColor: 'var(--background-color)' }}>
            <Card variant="outlined" sx={{ minWidth: 300, backgroundColor: 'var(--primary-color)' }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'var(--background-color)' }}>
                        Login
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <LoginForm onLogin={handleLogin} onError={setError} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
