// components/Header.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppBar,Toolbar,Button, Typography, IconButton, InputBase, FormControl, Select, MenuItem, Box, Snackbar} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  AccountCircle,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const { isLoggedIn, setIsLoggedIn, sessionExpiredMessage } =
    useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSearchType(type);

    if (type === "genre") {
      router.push("/genre-search");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // Redirect to the search page with query parameters
    router.push(
      `/search?term=${encodeURIComponent(searchTerm)}&type=${searchType}`
    );
  };

  useEffect(() => {
    if (sessionExpiredMessage) {
      setOpenSnackbar(true);
    }
  }, [sessionExpiredMessage]);

  const handleLogout = async () => {
    // Get token from the stored JSON object
    const tokenData = localStorage.getItem("tokenData");
    let token = null;
    if (tokenData) {
      token = JSON.parse(tokenData).token;
    }

    const response = await fetch("https://localhost:9876/ntuaflix_api/logout", {
      method: "POST",
      headers: {
        "X-OBSERVATORY-AUTH": token,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      localStorage.removeItem("tokenData");
      // Remove tokenData instead of just 'token'
      setIsLoggedIn(false);
      router.push("/");
    } else {
      console.error("Logout failed");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  

  return (
    <>
      {sessionExpiredMessage && (
        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          autoHideDuration={5000}
          message={sessionExpiredMessage}
        />
      )}
      <AppBar
        position="static"
        style={{
          backgroundColor: `rgb(var(--card-background-color))`,
          boxShadow: "var(--shadow)",
        }}
      >
        <Toolbar
          className="container"
          sx={{ display: "flex", justifyContent: "flex-start", width: "60%" }}
        >
          {/* NTUAFlix button moved to full left */}
          <Box sx={{ flexGrow: 0 }}>
            <Link href="/home" passHref>
              <Button
                sx={{
                  color: `rgb(var(--primary-color))`,
                  textTransform: "none",
                  fontSize: "1.25rem",
                }}
              >
                NTUAFlix
              </Button>
            </Link>
          </Box>
          <Box sx={{ml: 20, flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
              <Select
                value={searchType}
                onChange={handleTypeChange}
                displayEmpty
                inputProps={{ "aria-label": "search by type" }}
                sx={{
                  color: `rgb(var(--primary-color))`,
                  "& .MuiSvgIcon-root": { color: `rgb(var(--primary-color))` },
                }}
              >
                <MenuItem value="title">Search Title</MenuItem>
                <MenuItem value="name">Search Name</MenuItem>
                <MenuItem value="genre">Search by Genre</MenuItem>
              </Select>
            </FormControl>
            <InputBase
              sx={{ ml: 1, flex: 1, color: `rgb(var(--text-color))` }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <IconButton
              type="submit"
              sx={{ p: "10px", mr: 20, color: `rgb(var(--primary-color))` }} // Added right margin
              aria-label="search"
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </Box>

          <Box
            sx={{ flexGrow: 0, display: "flex", justifyContent: "flex-end" }}
          >
            {isLoggedIn ? (
              <>
                <Link href="/" passHref>
                  <IconButton sx={{ color: `rgb(var(--primary-color))` }}>
                    <AccountCircle />
                  </IconButton>
                </Link>
                <IconButton
                  sx={{ color: `rgb(var(--primary-color))` }}
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <Link href="/" passHref>
                <IconButton sx={{ color: `rgb(var(--primary-color))` }}>
                  <AccountCircle />
                </IconButton>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
