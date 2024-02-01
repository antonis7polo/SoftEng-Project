const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/user command', () => {


  it('successfully retrieves user data in JSON format', (done) => {
    shell.exec('se2321 user -u bothos12', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      expect(() => JSON.parse(stdout)).not.toThrow();
      done();
    });
  });

  it('successfully retrieves user data in CSV format', (done) => {
    shell.exec('se2321 user -u bothos12 -f csv', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(0);
      expect(stderr).toBe('');
      done();
    });
  });

  it('handles errors when user not found', (done) => {
    shell.exec('se2321 user -u nonExistentUser', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Error: User not found');
      done();
    });
  });

  //additional test for no token

  it('handles errors when no token provided', (done) => {
    clearToken();
    shell.exec('se2321 user -u bothos12', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Error');
      done();
    });
  });


});
