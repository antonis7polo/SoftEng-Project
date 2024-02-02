const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/uploadrating command', () => {
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
  it('successfully uploads rating with valid input', (done) => {

    shell.exec('se2321 uploadrating -u 5 -t tt0034841 -r 8', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Rating uploaded successfully');
      done();
    });
  });

  it('successfully uploads rating with valid input float', (done) => {

    shell.exec('se2321 uploadrating -u 5 -t tt0000977 -r 8.5', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(stdout).toContain('Rating uploaded successfully');
      done();
    });
  });




  it('displays error for invalid rating input', (done) => {
    shell.exec('se2321 uploadrating -u 5 -t tt0034841 -r 11', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Invalid rating. Please enter a number between 1 and 10.');
      done();
    });
  });

  it('displays error for invalid title input', (done) => {
    shell.exec('se2321 uploadrating -u 5 -t foo -r 8', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Invalid title ID');
      done();
    });
  });

  it('displays error for invalid user input', (done) => {
    shell.exec('se2321 uploadrating -u foo -t tt0034841 -r 8', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Unauthorized');
      done();
    });
  });

  it('displays not authenticated userID error', (done) => {
    shell.exec('se2321 uploadrating -u 6 -t tt0034841 -r 8', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('Unauthorized');
      done();
    });
  });

  it('displays no token found error', (done) => {
    clearToken();
    shell.exec('se2321 uploadrating -u 5 -t tt0034841 -r 8', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('token');
      done();
    });
  });

});