// pages/_app.js
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';



function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
        <div id="root">
          <Header />
          <main className="content">
            <Component {...pageProps} />
            </main>
            <Footer className="footer"/>
        </div>
        </AuthProvider>
    );
  }

export default MyApp;
