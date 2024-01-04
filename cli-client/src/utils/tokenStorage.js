const fs = require('fs');
const path = require('path');

const tokenFilePath = path.join(__dirname, '.token');

const storeToken = (token) => {
    fs.writeFileSync(tokenFilePath, token, 'utf8');
};

const getToken = () => {
    if (fs.existsSync(tokenFilePath)) {
        return fs.readFileSync(tokenFilePath, 'utf8');
    }
    return null;
};

const clearToken = () => {
    if (fs.existsSync(tokenFilePath)) {
        fs.unlinkSync(tokenFilePath);
    }
};

module.exports = {
    storeToken,
    getToken,
    clearToken
};
