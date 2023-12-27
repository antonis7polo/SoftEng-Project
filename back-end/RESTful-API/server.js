require('dotenv').config();
const fs = require('fs');
const https = require('https');

const app = require('./app');
const port = process.env.PORT || 9876;

const options = {
  key: fs.readFileSync('/Users/harrypapadakis/key.pem'),
  cert: fs.readFileSync('/Users/harrypapadakis/cert.pem')
};

https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 9876');
});
