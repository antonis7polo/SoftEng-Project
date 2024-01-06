// components/Header.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Home as HomeIcon, Search as SearchIcon, AccountCircle, Logout as LogoutIcon } from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from '../context/AuthContext';

const Header = () => {

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://localhost:9876/ntuaflix_api/logout', {
      method: 'POST',
      headers: {
        'X-OBSERVATORY-AUTH': token,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      router.push('/');
    } else {
      console.error('Logout failed');
    }
  };


  return (
    <AppBar position="static" style={{ backgroundColor: `rgb(var(--card-background-color))`, boxShadow: 'var(--shadow)' }}>
      <Toolbar className="container" sx={{ display: "flex", justifyContent: "space-between" }}>
        {isLoggedIn && (
        <Link href="/home" passHref>
          <IconButton sx={{ color: `rgb(var(--primary-color))` }}>
            <HomeIcon />
          </IconButton>
        </Link>
        )}
        <Typography variant="h6" component="div" sx={{ color: `rgb(var(--primary-color))` }}>
          NTUAFlix
        </Typography>
        <div>
          {isLoggedIn && (
          <Link href="/search" passHref>
            <IconButton sx={{ color: `rgb(var(--primary-color))` }}>
              <SearchIcon />
            </IconButton>
          </Link>
          )}
          {isLoggedIn && (
          <Link href="/" passHref>
            <IconButton sx={{ color: `rgb(var(--primary-color))` }}>
              <AccountCircle />
            </IconButton>
          </Link>
          )}
          {isLoggedIn && (
          <IconButton sx={{ color: `rgb(var(--primary-color))` }} onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
