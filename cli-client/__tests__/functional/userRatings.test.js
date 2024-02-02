const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/userratings command', () => {
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
        shell.exec('se2321 userratings --userid 1', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('userID', '1');
            expect(output).toHaveProperty('ratings');
            expect(output.ratings).toHaveLength(3);
            expect(output.ratings[0]).toHaveProperty('title_id', 'tt0000929');
            done();
        });
    });

    it('outputs valid CSV format', (done) => {
        const expectedCsv = `"title_id","user_rating"\n"tt0000929","5"\n"tt0000977","8.5"\n"tt0099006","9"\n`;

        shell.exec('se2321 userratings --userid 1 -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(4);
            expect(stdout).toBe(expectedCsv);
            done();
        });
    });

    it('handles errors for invalid user IDs', (done) => {
        shell.exec('se2321 userratings --userid 6', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0); // Non-zero exit code for error
            expect(stderr).not.toBe(''); // Error message should be present
            expect(stderr).toContain('Unauthorized');
            done();
        });
    });

    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 userratings -u 5', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('token');
            done();
        });
    });
});