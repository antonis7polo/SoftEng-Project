const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/healthcheck command', () => {
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

  it('successfully performs health check in JSON format', (done) => {
    shell.exec('se2321 healthcheck', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(() => JSON.parse(stdout)).not.toThrow();
      done();
    });
  });

  it('successfully performs health check in CSV format', (done) => {
    shell.exec('se2321 healthcheck -f csv', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      done();
    });
  });


  it('handles error when not logged in', (done) => {
    clearToken();

    shell.exec('se2321 healthcheck', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Health Check failed: No token found. You are not logged in.');
      done();
    });
  });

});
