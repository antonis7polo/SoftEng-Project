const shell = require('shelljs');
const { clearToken } = require('../src/utils/tokenStorage');

describe('/adduser command', () => {

    it('successfully adds a new user', (done) => {

        shell.exec("se2321 adduser -u anton1 -p anton1 -e anton1232@example.com -a 1", { silent: true }, (code, stdout, stderr) => {
        expect(code).toBe(0);
        expect(stderr).toBe('');
        expect(stdout).toContain('User added/updated successfully.');
        done();
        });
    });

  it('handles invalid isAdmin value', (done) => {
    shell.exec('se2321 adduser -u newUsername -p newPassword -e newUser@example.com -a 3', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Failed to add/update user');
      done();
    });
  });

  it('handles duplicate email', (done) => {
    shell.exec('se2321 adduser -u anton2 -p anton2 -e anton1232@example.com -a 1 ', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Failed to add/update user');
      done();
    });
  });

  it('handles error when not logged in', (done) => {
    clearToken(); // Simulate not being logged in

    shell.exec('se2321 adduser -u anton12 -p newPass -e anton@example.com -a 1', { silent: true }, (code, stdout, stderr) => {
      expect(code).toBe(1);
      expect(stderr).toContain('Failed to add/update user: No token found. You are not logged in.');
      done();
    });
  });

});

