const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/bygenre command', () => {

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

    it('outputs valid JSON with correct structure and content', (done) => {
        shell.exec('se2321 bygenre --genre Comedy --min 8.2', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('titleObjects');
            expect(Array.isArray(output.titleObjects)).toBeTruthy();
            expect(output.titleObjects).toHaveLength(2);
            expect(output.titleObjects[0]).toHaveProperty('titleID', 'tt0099851');
            expect(output.titleObjects[1]).toHaveProperty('titleID', 'tt0103062');
            done();
        });
    });

    it('outputs valid CSV with correct structure and content', (done) => {
        shell.exec('se2321 bygenre -g Comedy -m 8.2 -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(3); // 2 data rows + 1 header row
            const expectedHeader = "\"titleID\",\"type\",\"originalTitle\",\"titlePoster\",\"startYear\",\"endYear\",\"genres\",\"titleAkas\",\"principals\",\"avRating\",\"nVotes\"";
            expect(rows[0]).toBe(expectedHeader);
            expect(rows[1]).toContain('tt0099851'); // Check for specific titleID in first data row
            expect(rows[2]).toContain('tt0103062'); // Check for specific titleID in second data row
            done();
        });
    });


    it('outputs valid JSON with correct structure and content for start year from 1992', (done) => {
        shell.exec('se2321 bygenre -g Comedy -m 7 --from 1992', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('titleObjects');
            expect(Array.isArray(output.titleObjects)).toBeTruthy();
            expect(output.titleObjects).toHaveLength(2);
            expect(output.titleObjects[0]).toHaveProperty('titleID', 'tt0070501');
            expect(output.titleObjects[1]).toHaveProperty('titleID', 'tt0103145');
            done();
        });
    });

    it('outputs valid CSV with correct structure and content for start year from 1992', (done) => {
        shell.exec('se2321 bygenre -g Comedy -m 7 --from 1992 -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(3); // 2 data rows + 1 header row
            const expectedHeader = "\"titleID\",\"type\",\"originalTitle\",\"titlePoster\",\"startYear\",\"endYear\",\"genres\",\"titleAkas\",\"principals\",\"avRating\",\"nVotes\"";
            expect(rows[0]).toBe(expectedHeader);
            expect(rows[1]).toContain('tt0070501'); // Check for specific titleID in first data row
            expect(rows[2]).toContain('tt0103145'); // Check for specific titleID in second data row
            done();
        });
    });

    it('outputs valid JSON with correct structure and content for start year from 1991 to 1992', (done) => {
        shell.exec('se2321 bygenre -g Comedy -m 7.5 --from 1991 --to 1992', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('titleObjects');
            expect(Array.isArray(output.titleObjects)).toBeTruthy();
            expect(output.titleObjects).toHaveLength(7);
            done();
        });
    });

    it('outputs valid CSV with correct structure and content for start year from 1991 to 1992', (done) => {
        shell.exec('se2321 bygenre -g Comedy -m 7.5 --from 1991 --to 1992 -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows.length).toBe(8); // 7 data rows + 1 header row
            const expectedHeader = "\"titleID\",\"type\",\"originalTitle\",\"titlePoster\",\"startYear\",\"endYear\",\"genres\",\"titleAkas\",\"principals\",\"avRating\",\"nVotes\"";
            expect(rows[0]).toBe(expectedHeader);
            done();
        });
    });

    it('handles invalid genres properly', (done) => {
        shell.exec('se2321 bygenre -g InvalidGenre -m 7', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0); // Non-zero exit code for error
            expect(stderr).not.toBe(''); // Error message should be present
            expect(stderr).toContain('Error');

            done();
        });
    });

    it('handles no results found properly', (done) => {
        shell.exec('se2321 bygenre -g Comedy -m 10', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0); // Non-zero exit code for error
            expect(stderr).not.toBe(''); // Error message should be present
            expect(stderr).toContain('Error');
            done();
        });
    });


    it('handles no token found scenario', (done) => {
        clearToken();
        shell.exec('se2321 bygenre -g Comedy -m 7', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('No token found');
            done();
        });
    });

});








