const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/tvshowsepisodes command', () => {
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
    it('ouputs valid JSON format', (done) => {
        shell.exec('se2321 tvshowsepisodes', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('shows');
            expect(output.shows).toHaveProperty('tt0098889');
            expect(output.shows.tt0098889).toHaveProperty('1');
            expect(output.shows.tt0098889['1']).toHaveLength(2);
            done();

        });
    });

    it('outputs valid CSV format', (done) => {
        shell.exec('se2321 tvshowsepisodes -f csv', { silent: true }, (code, stdout, stderr) => {
            const rows = stdout.trim().split('\n');
            expect(rows).toHaveLength(151); // Header + 150 Data Rows

            const headers = rows[0].split(',');

            expect(headers).toEqual(['"episode_title_id"', '"episode_title"', '"parent_tv_show_title_id"', '"season_number"', '"episode_number"']);
            done();
        });
    });

    it('handles no token found scenario', (done) => {
        clearToken();

        shell.exec('se2321 tvshowsepisodes', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('token');
            done();
        });
    });


});

