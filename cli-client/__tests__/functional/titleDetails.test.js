const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/titledetails command', () => {
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
        shell.exec('se2321 titledetails --titleid tt0092984', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('titleDetails');
            expect(output.titleDetails).toHaveProperty('titleID', 'tt0092984');
            expect(output.titleDetails).toHaveProperty('genres');
            expect(output.titleDetails.genres).toHaveLength(1);
            expect(output.titleDetails.genres[0]).toHaveProperty('genreTitle', 'Comedy');
            expect(output.titleDetails).toHaveProperty('leadActors');
            expect(output.titleDetails.leadActors).toHaveLength(2);
            expect(output.titleDetails.leadActors[0]).toHaveProperty('nameID', 'nm0654843');
            expect(output.titleDetails).toHaveProperty('directors');
            expect(output.titleDetails.directors).toHaveLength(1);
            expect(output.titleDetails.directors[0]).toHaveProperty('nameID', 'nm0654839');
            done();
        });
    });

    it('outputs valid CSV format', (done) => {
        shell.exec('se2321 titledetails --titleid tt0092984 -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows).toHaveLength(2); // Header + Data Row

            const headers = rows[0].split(',');
            const data = rows[1].split(',');

            expect(headers).toEqual(['"titleID"', '"genres"', '"leadActors"', '"directors"']);
            expect(data).toEqual(['"tt0092984"', '"Comedy"', '"nm0654843; nm0174290"', '"nm0654839"']);
            done();
        });
    });

    it('handles errors for invalid title IDs', (done) => {
        shell.exec('se2321 titledetails --titleid invalidID', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0); // Non-zero exit code for error
            expect(stderr).not.toBe(''); // Error message should be present
            done();
        });
    });

    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 titledetails -i tt0092984', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('token');
            done();
        });
    });



});