const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/searchname command', () => {
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
        shell.exec('se2321 searchname --name green', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('nameObjects');
            expect(output.nameObjects).toHaveLength(11);
            expect(output.nameObjects[0]).toHaveProperty('nameID', 'nm0337742');
            done();
        });
    });

    it('outputs valid CSV format', (done) => {
        shell.exec('se2321 searchname --name green -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(12); // Including the header, there should be 12 rows
            expect(stdout).toContain('nm0337742'); // Check for nameID in CSV
            done();
        });
    });

    it('handles errors for invalid name IDs', (done) => {
        shell.exec('se2321 searchname --name woowoo', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0); // Non-zero exit code for error
            expect(stderr).not.toBe(''); // Error message should be present
            expect(stderr).toContain('No matching names');
            done();
        });
    });

    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 searchname -n The', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('token');
            done();
        });
    });
});