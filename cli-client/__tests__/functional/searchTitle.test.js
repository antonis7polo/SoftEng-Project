const shell = require('shelljs');
const {clearToken} = require('../../src/utils/tokenStorage');

describe('/searchtitle command', () => {
    it('outputs valid JSON format',  (done) => {
        shell.exec('se2321 searchtitle --titlepart wood', {silent: true}, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('titleObjects');
            expect(output.titleObjects).toHaveLength(3);
            done();
        });
    });

    it('outputs valid CSV format', (done) => {
        shell.exec('se2321 searchtitle --titlepart wood -f csv', {silent: true}, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(4); // Including the header, there should be 4 rows
            expect(stdout).toContain('tt0099851'); // Check for titleID in CSV
            done();
        });
    });

    it('handles errors for invalid title IDs',  (done) => {
        shell.exec('se2321 searchtitle --titlepart woowoo', {silent: true}, (code, stdout, stderr) => {
          expect(code).not.toBe(0); // Non-zero exit code for error
          expect(stderr).not.toBe(''); // Error message should be present
          expect(stderr).toContain('No titles found');
          done();
        });
    });


    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 searchtitle -t The', {silent: true}, (code, stdout, stderr) => {
          expect(code).not.toBe(0);
          expect(stderr).toContain('token');
          done();
        });
    });
});
