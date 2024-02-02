const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/deleterating command', () => {

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
  it('successfully deletes rating with valid input', (done) => {

    shell.exec('se2321 deleterating -u 1 -t tt0097949', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Rating deleted successfully');
      done();
    });
  });

  it('displays error for invalid title input (title already deleted)', (done) => {
    shell.exec('se2321 deleterating -u 1 -t tt0097949', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Failed to delete rating');
      done();
    });
  });

  it('displays error for invalid title input', (done) => {
    shell.exec('se2321 deleterating -u 1 -t foo', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Failed to delete rating');
      done();
    });
  });




  it('displays error for invalid user input', (done) => {
    shell.exec('se2321 deleterating -u foo -t tt0034841', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Unauthorized');
      done();
    });
  });

  it('displays not authenticated userID error', (done) => {
    shell.exec('se2321 deleterating -u 6 -t tt0034841', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Unauthorized');
      done();
    });
  });

  it('displays no token found error', (done) => {
    clearToken();

    shell.exec('se2321 deleterating -u 5 -t tt0034841', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('token');
      done();
    });
  });
});