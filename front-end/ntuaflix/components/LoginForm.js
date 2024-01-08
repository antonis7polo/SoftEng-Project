// components/LoginForm.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const LoginForm = ({ onLogin, onError }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await onLogin(credentials);
        } catch (error) {
            onError(error);
        }
    };

 return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={credentials.username}
                onChange={e => handleChange(e)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={e => handleChange(e)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: 'var(--button-background-color)', '&:hover': { bgcolor: 'var(--button-hover-background-color)' } }}
            >
                Log In
            </Button>
        </Box>
    );
};
export default LoginForm;
