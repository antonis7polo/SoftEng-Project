const shell = require('shelljs');
const {clearToken} = require('../src/utils/tokenStorage');

describe('/userratings command', () => {

    it('outputs valid JSON format',  (done) => {
        shell.exec('se2321 userratings --userid 5', {silent: true}, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('userID', '5');
            expect(output).toHaveProperty('ratings');
            expect(output.ratings).toHaveLength(4);
            expect(output.ratings[0]).toHaveProperty('title_id', 'tt0015414');
            done();
        });
    });

    it('outputs valid CSV format', (done) => {
        const expectedCsv = `"title_id","user_rating"\n"tt0015414","7.6"\n"tt0000929","7.5"\n"tt0034841","8"\n"tt0000977","8.5"\n`;

        shell.exec('se2321 userratings --userid 5 -f csv', {silent: true}, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(5); 
            expect(stdout).toBe(expectedCsv);
            done();
        });
    });

    it('handles errors for invalid user IDs',  (done) => {
        shell.exec('se2321 userratings --userid 6', {silent: true}, (code, stdout, stderr) => {
          expect(code).not.toBe(0); // Non-zero exit code for error
          expect(stderr).not.toBe(''); // Error message should be present
          expect(stderr).toContain('Unauthorized');
          done();
        });
    });

    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 userratings -u 5', {silent: true}, (code, stdout, stderr) => {
          expect(code).not.toBe(0);
          expect(stderr).toContain('token');
          done();
        });
    });
});