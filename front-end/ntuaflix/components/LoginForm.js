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
        <Box className='login-form' component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 } }>
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
                sx={{
                    '& label': { color: 'var(--button-text-color)' }, // Label color
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
                sx={{
                    '& label': { color: 'var(--button-text-color)' }, // Label color
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
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: 'var(--button-text-color)' , bgcolor: 'var(--button-background-color)', '&:hover': { bgcolor: 'var(--button-hover-background-color)' } }}
            >
                Log In
            </Button>
        </Box>
    );
};
export default LoginForm;
