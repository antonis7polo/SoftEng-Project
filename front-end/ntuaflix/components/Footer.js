// components/Footer.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer = ({className}) => {
  return (
    <AppBar
      className={className}
      position="static"
      component="footer"
      style={{
        
        boxShadow: "var(--shadow)",
        marginTop: 'auto', // Ensures that the footer is at the bottom
      }}
    >
      <Toolbar
        className="container"
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Typography
          variant="body1"
          style={{ color: `var(--button-text-color)` }}
        >
          © {new Date().getFullYear()} NTUAFlix. All rights reserved.
        </Typography>
        {/* Add additional footer links or content here */}
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
