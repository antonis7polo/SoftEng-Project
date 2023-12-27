const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemon = require('nodemon');
const mysql2 = require('mysql2');


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes used */
const authRoutes = require('./routes/authRoutes'); 

app.use('/ntuaflix_api', authRoutes);

module.exports = app;


