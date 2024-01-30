// server.js
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    passphrase: process.env.KEY_PASSPHRASE
};


app.prepare().then(() => {
  const server = express();


  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  createServer(httpsOptions, server).listen(3000, () => {
    console.log('> Server started on https://localhost:3000');
  });
});
