const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/home command', () => {
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
    shell.exec('se2321 home', { silent: true }, (code, stdout, stderr) => {
      const output = JSON.parse(stdout);
      expect(output).toHaveProperty('data');
      expect(output.data).toHaveProperty('topRatedMovies');
      expect(output.data.topRatedMovies).toHaveLength(20);
      expect(output.data.topRatedMovies[0]).toHaveProperty('titleID', 'tt0097949');
      expect(output.data).toHaveProperty('newReleases');
      expect(output.data.newReleases).toHaveLength(20);
      expect(output.data.newReleases[0]).toHaveProperty('titleID', 'tt0015414');
      expect(output.data).toHaveProperty('popularInComedy');
      expect(output.data.popularInComedy).toHaveLength(10);
      done();
    });
  });

  it('outputs valid CSV format', (done) => {
    shell.exec('se2321 home -f csv', { silent: true }, (code, stdout, stderr) => {
      const rows = stdout.trim().split('\n');
      expect(rows).toHaveLength(2); // Header + Data Row

      const headers = rows[0].split(',');
      const data = rows[1].split(',');
      expect(headers).toEqual(['"topRatedMovies"', '"newReleases"', '"popularInAction"', '"popularInComedy"', '"popularInDrama"', '"popularInRomance"', '"popularInThriller"', '"popularInHorror"', '"popularInDocumentary"', '"popularInAdventure"']);
      done();
    });
  });

  it('handles no token found scenario', (done) => {
    clearToken();

    shell.exec('se2321 home', { silent: true }, (code, stdout, stderr) => {
      expect(code).not.toBe(0);
      expect(stderr).toContain('token');
      done();
    });
  });

});
