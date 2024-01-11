const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemon = require('nodemon');
const mysql2 = require('mysql2');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


const openapiSpecification = YAML.load('./openapi.yaml');


const app = express();

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes used */
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const titleRoutes = require('./routes/titleRoutes');
const nameRoutes = require('./routes/nameRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

app.use('/ntuaflix_api', authRoutes);
app.use('/ntuaflix_api/admin', adminRoutes);
app.use('/ntuaflix_api', titleRoutes);
app.use('/ntuaflix_api', nameRoutes);
app.use('/ntuaflix_api', ratingRoutes);

module.exports = app;


