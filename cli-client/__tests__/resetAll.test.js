const shell = require('shelljs');
const { clearToken } = require('../src/utils/tokenStorage');

describe('/resetall command', () => {

  it('successfully performs reset all operation', (done) => {
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
        expect(stdout).toContain('Your ID is: 22');
    
        shell.exec('se2321 resetall', { silent: true }, (code, stdout, stderr) => {
            expect(code).toBe(1);
            expect(stderr).toContain('Reset all operation failed: Not Authorized');
            done();
        });
        });
    });


});
