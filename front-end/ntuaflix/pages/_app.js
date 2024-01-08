// pages/_app.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(var(--primary-color))',
    },
    secondary: {
      main: 'rgb(var(--secondary-color))',
    },
    background: {
      default: 'rgb(var(--background-color))',
    },
  },
  // Additional customization as needed
});



function MyApp({ Component, pageProps }) {
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider>
        <div id="root">
          <Header />
          <main className="content">
            <Component {...pageProps} />
            </main>
            <Footer className="footer"/>
        </div>
        </AuthProvider>
      </ThemeProvider>
    );
  }

export default MyApp;
