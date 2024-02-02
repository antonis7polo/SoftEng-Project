const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const tokenFilePath =  path.join(__dirname, '../../src/utils/.token');

  describe('/login command', () => {

    it('successfully logs in with valid credentials', (done) => {

        shell.exec('se2321 login -u harrypap -p el20022', {silent: true}, (code, stdout, stderr) => {
        expect(code).toBe(0);
        expect(stderr).toBe('');
        expect(stdout).toContain('Welcome to NTUAFLIX!');
        expect(stdout).toContain('Your ID is: 1');

        if (fs.existsSync(tokenFilePath)) {
            const storedToken = fs.readFileSync(tokenFilePath, 'utf8');
            expect(storedToken).toMatch(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/); // Regex for JWT format
        } else {
            throw new Error('Token file not found');
        }

        done();
        });
    });

    it('fails to log in with invalid credentials', (done) => {

        shell.exec('se2321 login -u newUsername -p newPasswords', {silent: true}, (code, stdout, stderr) => {
        expect(code).toBe(1);
        expect(stderr).toContain('Login failed:');
        expect(stdout).toBe('');
        done();
        });
  });

  });




  

  
