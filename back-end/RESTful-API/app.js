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
const adminRoutes = require('./routes/adminRoutes');
const titleRoutes = require('./routes/titleRoutes');
const nameRoutes = require('./routes/nameRoutes');

app.use('/ntuaflix_api', authRoutes);
app.use('/ntuaflix_api/admin', adminRoutes);
app.use('/ntuaflix_api', titleRoutes);
app.use('/ntuaflix_api', nameRoutes);

module.exports = app;


