const shell = require('shelljs');
const { clearToken } = require('../../src/utils/tokenStorage');

describe('/recommendations command', () => {
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
    
    it('outputs valid JSON format for 2 genres, 2 actors and 1 director', (done) => {
        shell.exec('se2321 recommendations -g Comedy,drama -a nm0817881,nm0270607 -d  nm0654839', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('movies');
            expect(output.movies).toHaveLength(30);
            const uniqueIds = new Set(output.movies.map(movie => movie.title_id));
            expect(uniqueIds.size).toBe(output.movies.length); // Ensure no duplicates
            done();
        });
    });

    it('outputs valid JSON format for 2 genres, 1 actor and 1 director', (done) => {
        shell.exec('se2321 recommendations -g Comedy,drama -a nm0817881 -d  nm0654839', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('movies');
            expect(output.movies).toHaveLength(25);
            const uniqueIds = new Set(output.movies.map(movie => movie.title_id));
            expect(uniqueIds.size).toBe(output.movies.length); // Ensure no duplicates
            done();
        });
    });

    it('outputs valid JSON format for 2 genres, no actors (invalid id) and 1 director', (done) => {
        shell.exec('se2321 recommendations -g Comedy,drama -a foo -d  nm0654839', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('movies');
            expect(output.movies).toHaveLength(19);
            const uniqueIds = new Set(output.movies.map(movie => movie.title_id));
            expect(uniqueIds.size).toBe(output.movies.length); // Ensure no duplicates
            done();
        });
    });

    it('outputs valid JSON format for 1 genre, no actors (invalid id) and 1 director', (done) => {
        shell.exec('se2321 recommendations -g comedy -a foo -d  nm0654839', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('movies');
            expect(output.movies).toHaveLength(13);
            const uniqueIds = new Set(output.movies.map(movie => movie.title_id));
            expect(uniqueIds.size).toBe(output.movies.length); // Ensure no duplicates
            done();
        });
    });


    it('outputs valid JSON format for 1 genre, no actors (invalid id) and no directors (invalid id)', (done) => {
        shell.exec('se2321 recommendations -g comedy -a foo -d foo', { silent: true }, (code, stdout, stderr) => {
            const output = JSON.parse(stdout);
            expect(output).toHaveProperty('movies');
            expect(output.movies).toHaveLength(10);
            const uniqueIds = new Set(output.movies.map(movie => movie.title_id));
            expect(uniqueIds.size).toBe(output.movies.length); // Ensure no duplicates
            done();
        });
    });


    // Example test case for CSV output
    it('outputs valid CSV format for 2 genres, 2 actors and 1 director', (done) => {
        shell.exec('se2321 recommendations -g Comedy,drama -a nm0817881,nm0270607 -d nm0654839 -f csv', { silent: true }, (code, stdout, stderr) => {
            // Instead of JSON parsing, validate the CSV format
            const lines = stdout.trim().split('\n');
            expect(lines[0]).toBe('"title_id","original_title","image_url_poster","average_rating","num_votes"'); // Check CSV header
            expect(lines.length).toBe(31); // Including header + 30 movies
            const movieIds = lines.slice(1).map(line => line.split(',')[0]);
            const uniqueIds = new Set(movieIds);
            expect(uniqueIds.size).toBe(lines.length - 1); // Excluding header, ensure no duplicates
            done();
        });
    });

    it('outputs valid CSV format for 2 genres, 1 actor and 1 director', (done) => {
        shell.exec('se2321 recommendations -g Comedy,drama -a nm0817881 -d nm0654839 -f csv', { silent: true }, (code, stdout, stderr) => {
            // Instead of JSON parsing, validate the CSV format
            const lines = stdout.trim().split('\n');
            expect(lines[0]).toBe('"title_id","original_title","image_url_poster","average_rating","num_votes"'); // Check CSV header
            expect(lines.length).toBe(26); // Including header + 25 movies
            const movieIds = lines.slice(1).map(line => line.split(',')[0]);
            const uniqueIds = new Set(movieIds);
            expect(uniqueIds.size).toBe(lines.length - 1); // Excluding header, ensure no duplicates
            done();
        });
    });

    it('outputs valid CSV format for 2 genres, no actors (invalid id) and 1 director', (done) => {
        shell.exec('se2321 recommendations -g Comedy,drama -a foo -d nm0654839 -f csv', { silent: true }, (code, stdout, stderr) => {
            // Instead of JSON parsing, validate the CSV format
            const lines = stdout.trim().split('\n');
            expect(lines[0]).toBe('"title_id","original_title","image_url_poster","average_rating","num_votes"'); // Check CSV header
            expect(lines.length).toBe(20); // Including header + 19 movies
            const movieIds = lines.slice(1).map(line => line.split(',')[0]);
            const uniqueIds = new Set(movieIds);
            expect(uniqueIds.size).toBe(lines.length - 1); // Excluding header, ensure no duplicates
            done();
        });
    });

    it('outputs valid CSV format for 1 genre, no actors (invalid id) and 1 director', (done) => {
        shell.exec('se2321 recommendations -g comedy -a foo -d nm0654839 -f csv', { silent: true }, (code, stdout, stderr) => {
            // Instead of JSON parsing, validate the CSV format
            const lines = stdout.trim().split('\n');
            expect(lines[0]).toBe('"title_id","original_title","image_url_poster","average_rating","num_votes"'); // Check CSV header
            expect(lines.length).toBe(14); // Including header + 13 movies
            const movieIds = lines.slice(1).map(line => line.split(',')[0]);
            const uniqueIds = new Set(movieIds);
            expect(uniqueIds.size).toBe(lines.length - 1); // Excluding header, ensure no duplicates
            done();
        });
    });

    it('outputs valid CSV format for 1 genre, no actors (invalid id) and no directors (invalid id)', (done) => {
        shell.exec('se2321 recommendations -g comedy -a foo -d foo -f csv', { silent: true }, (code, stdout, stderr) => {
            // Instead of JSON parsing, validate the CSV format
            const lines = stdout.trim().split('\n');
            expect(lines[0]).toBe('"title_id","original_title","image_url_poster","average_rating","num_votes"'); // Check CSV header
            expect(lines.length).toBe(11); // Including header + 10 movies
            const movieIds = lines.slice(1).map(line => line.split(',')[0]);
            const uniqueIds = new Set(movieIds);
            expect(uniqueIds.size).toBe(lines.length - 1); // Excluding header, ensure no duplicates
            done();
        });
    });

    it('outputs invalid token error message when token is invalid', (done) => {
        clearToken();
        shell.exec('se2321 recommendations -g comedy -a foo -d foo -f csv', { silent: true }, (code, stdout, stderr) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('token');
            expect(stdout).toBe('');
            done();
        });
    });




});









