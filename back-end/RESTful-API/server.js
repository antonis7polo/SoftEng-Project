require('dotenv').config();
const fs = require('fs');
const https = require('https');

const app = require('./app');
const port = process.env.PORT || 9876;

const options = {
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH)
};


https.createServer(options, app).listen(port, () => {
  console.log('HTTPS server running on port 9876');
});
