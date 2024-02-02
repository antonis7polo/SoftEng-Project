const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/name command', () => {
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
        shell.exec('se2321 name --nameid nm0000035', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('nameObject');
            expect(output.nameObject).toHaveProperty('nameID', 'nm0000035');
            done();
        });
    });

    it('outputs valid CSV format', (done) => {
        shell.exec('se2321 name --nameid nm0000035 -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(2); // 1 data row + 1 header row
            expect(stdout).toContain('nm0000035'); // Check for nameID in CSV
            done();
        });
    });

    it('handles errors for invalid name IDs', (done) => {
        shell.exec('se2321 name --nameid invalidID', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0); // Non-zero exit code for error
            expect(stderr).not.toBe(''); // Error message should be present
            done();
        });
    });

    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 name -n nm0000035', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('token');
            done();
        });
    });

});