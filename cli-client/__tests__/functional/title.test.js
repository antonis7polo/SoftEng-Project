const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/title command', () => {

  beforeAll((done) => {
    // Execute login command
    shell.exec('se2321 login --username harrypap --passw el20022', { silent: true }, (code, stdout, stderr) => {
      if (code === 0) {
        done(); // Proceed to tests after successful login
      } else {
        done(new Error('Login failed, cannot proceed with tests'));
      }
    });
  });


  it('outputs valid JSON format', (done) => {
    shell.exec('se2321 title --titleID tt0099851', { silent: true }, (code, stdout, stderr) => {
      const output = JSON.parse(stdout);
      expect(output).toHaveProperty('titleObject');
      expect(output.titleObject).toHaveProperty('titleID', 'tt0099851');
      done();
    });
  });


  it('outputs valid CSV format', (done) => {
    shell.exec('se2321 title --titleID tt0099851 -f csv', { silent: true }, (code, stdout, stderr) => {
      expect(stdout).toContain('tt0099851'); // Check for titleID in CSV
      done();
    });
  });

  it('handles errors for invalid title IDs', (done) => {
    shell.exec('se2321 title --titleID invalidID', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0); // Non-zero exit code for error
      expect(stderr).not.toBe(''); // Error message should be present
      done();
    });
  });

  it('handles no token found scenario', (done) => {
    clearToken();

    shell.exec('se2321 title -t tt0099851', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('token');
      done();
    });
  });



});