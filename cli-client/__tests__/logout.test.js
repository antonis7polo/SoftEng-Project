const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const tokenFilePath =  path.join(__dirname, '../src/utils/.token');


describe('/logout command', () => {

    it('successfully logs out', (done) => {
  
      shell.exec('se2321 logout', {silent: true}, (code, stdout, stderr) => {
        expect(code).toBe(0);
        expect(stderr).toBe('');
        expect(stdout).toContain('Logout successful!');
  
        // Check if the token is cleared
        expect(fs.existsSync(tokenFilePath)).toBe(false);
  
        done();
      });
    });
  
    it('handles error when not logged in', (done) => {
      shell.exec('se2321 logout', {silent: true}, (code, stdout, stderr) => {
        expect(code).toBe(1);
        expect(stderr).toContain('Logout failed: No token found. You are not logged in.');
        done();
      });
    });
  
  
  });