const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/resetall command', () => {
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

  it('successfully performs reset all operation', (done) => {
    jest.setTimeout(20000); // Increase timeout to 20 seconds
    shell.exec('se2321 resetall', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Reset all operation successful');
      done();
    });
  });

  it('handles error when not logged in', (done) => {
    clearToken(); // Simulate not being logged in

    shell.exec('se2321 resetall', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Reset all operation failed: No token found. You are not logged in.');
      done();
    });
  });

  it('handles error when not admin', (done) => {
    shell.exec('se2321 login -u bothos12 -p nick123', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Welcome to NTUAFLIX!');
      expect(stdout).toContain('Your ID is: 8');

      shell.exec('se2321 resetall', { silent: true }, (code, stdout, stderr) => {
        expect(code).toBe(1);
        expect(stderr).toContain('Reset all operation failed: Not Authorized');
        done();
      });
    });
  });

});
