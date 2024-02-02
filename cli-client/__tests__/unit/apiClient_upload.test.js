const nock = require('nock');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const { uploadTitleBasics, uploadTitleAkas, uploadNameBasics, uploadTitleCrew, uploadTitleEpisode, uploadTitlePrincipals, uploadTitleRatings } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
}));

jest.mock('fs');


describe('uploadTitleBasics', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validAdminToken123';
    const filePath = '/path/to/file.tsv';
    
    beforeEach(() => {
      nock.cleanAll();
      getToken.mockReturnValue(token); // Assume a valid token is always returned
      fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
    });
  
    it('successfully uploads title basics data', async () => {
      const mockResponse = { message: 'File processed and data inserted successfully' };
  
      nock(baseURL)
        .post('/admin/upload/titlebasics')
        .matchHeader('x-observatory-auth', token)
        .reply(200, mockResponse);
  
      const response = await uploadTitleBasics(filePath);
      expect(response).toEqual(mockResponse);
    });
  
    it('throws an error for no file uploaded or wrong file type', async () => {
      nock(baseURL)
        .post('/admin/upload/titlebasics')
        .matchHeader('x-observatory-auth', token)
        .reply(400, { message: 'No file uploaded or wrong file type uploaded' });
  
      await expect(uploadTitleBasics(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);

        await expect(uploadTitleBasics(filePath)).rejects.toThrow('No token found');
    });
  
    it('throws an error for unauthorized access', async () => {
      getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token
      
      nock(baseURL)
        .post('/admin/upload/titlebasics')
        .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });
  
      await expect(uploadTitleBasics(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
    });
  
    it('handles server error during file upload', async () => {
      nock(baseURL)
        .post('/admin/upload/titlebasics')
        .matchHeader('x-observatory-auth', token)
        .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });
  
      await expect(uploadTitleBasics(filePath)).rejects.toThrow('Error processing file or internal server error');
    });

  });

    describe('uploadTitleAkas', () => {
        const baseURL = 'https://localhost:9876/ntuaflix_api';
        const token = 'validAdminToken123';
        const filePath = '/path/to/file.tsv';

        beforeEach(() => {
            nock.cleanAll();
            getToken.mockReturnValue(token); // Assume a valid token is always returned
            fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
        });
        
        it('successfully uploads title akas data', async () => {
            const mockResponse = { message: 'File processed and data inserted successfully' };

            nock(baseURL)
                .post('/admin/upload/titleakas')
                .matchHeader('x-observatory-auth', token)
                .reply(200, mockResponse);

            const response = await uploadTitleAkas(filePath);
            expect(response).toEqual(mockResponse);
        });

        it('throws an error for no file uploaded or wrong file type', async () => {
            nock(baseURL)
                .post('/admin/upload/titleakas')
                .matchHeader('x-observatory-auth', token)
                .reply(400, { message: 'No file uploaded or wrong file type uploaded' });

            await expect(uploadTitleAkas(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
        });

        it('throws an error if no token is found', async () => {
            getToken.mockReturnValue(null);

            await expect(uploadTitleAkas(filePath)).rejects.toThrow('No token found');
        });

        it('throws an error for unauthorized access', async () => {
            getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

            nock(baseURL)
                .post('/admin/upload/titleakas')
                .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

            await expect(uploadTitleAkas(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
        });

        it('handles server error during file upload', async () => {
            nock(baseURL)
                .post('/admin/upload/titleakas')
                .matchHeader('x-observatory-auth', token)
                .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });

            await expect(uploadTitleAkas(filePath)).rejects.toThrow('Error processing file or internal server error');
        });
    });

    describe('uploadNameBasics', () => {
        const baseURL = 'https://localhost:9876/ntuaflix_api';
        const token = 'validAdminToken123';
        const filePath = '/path/to/file.tsv';

        beforeEach(() => {
            nock.cleanAll();
            getToken.mockReturnValue(token); // Assume a valid token is always returned
            fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
        });

        it('successfully uploads name basics data', async () => {
            const mockResponse = { message: 'File processed and data inserted successfully' };

            nock(baseURL)
                .post('/admin/upload/namebasics')
                .matchHeader('x-observatory-auth', token)
                .reply(200, mockResponse);

            const response = await uploadNameBasics(filePath);
            expect(response).toEqual(mockResponse);
        });

        it('throws an error for no file uploaded or wrong file type', async () => {
            nock(baseURL)
                .post('/admin/upload/namebasics')
                .matchHeader('x-observatory-auth', token)
                .reply(400, { message: 'No file uploaded or wrong file type uploaded' });

            await expect(uploadNameBasics(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
        });

        it('throws an error if no token is found', async () => {
            getToken.mockReturnValue(null);

            await expect(uploadNameBasics(filePath)).rejects.toThrow('No token found');
        });

        it('throws an error for unauthorized access', async () => {
            getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

            nock(baseURL)
                .post('/admin/upload/namebasics')
                .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

            await expect(uploadNameBasics(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
        });

        it('handles server error during file upload', async () => {
            nock(baseURL)
                .post('/admin/upload/namebasics')
                .matchHeader('x-observatory-auth', token)
                .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });

            await expect(uploadNameBasics(filePath)).rejects.toThrow('Error processing file or internal server error');
        });
    });

    describe('uploadTitleCrew', () => {
        const baseURL = 'https://localhost:9876/ntuaflix_api';
        const token = 'validAdminToken123';
        const filePath = '/path/to/file.tsv';

        beforeEach(() => {
            nock.cleanAll();
            getToken.mockReturnValue(token); // Assume a valid token is always returned
            fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
        });

        it('successfully uploads title crew data', async () => {
            const mockResponse = { message: 'File processed and data inserted successfully' };

            nock(baseURL)
                .post('/admin/upload/titlecrew')
                .matchHeader('x-observatory-auth', token)
                .reply(200, mockResponse);

            const response = await uploadTitleCrew(filePath);
            expect(response).toEqual(mockResponse);
        });

        it('throws an error for no file uploaded or wrong file type', async () => {
            nock(baseURL)
                .post('/admin/upload/titlecrew')
                .matchHeader('x-observatory-auth', token)
                .reply(400, { message: 'No file uploaded or wrong file type uploaded' });

            await expect(uploadTitleCrew(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
        });

        it('throws an error if no token is found', async () => {
            getToken.mockReturnValue(null);

            await expect(uploadTitleCrew(filePath)).rejects.toThrow('No token found');
        });

        it('throws an error for unauthorized access', async () => {
            getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

            nock(baseURL)
                .post('/admin/upload/titlecrew')
                .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

            await expect(uploadTitleCrew(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
        });

        it('handles server error during file upload', async () => {
            nock(baseURL)
                .post('/admin/upload/titlecrew')
                .matchHeader('x-observatory-auth', token)
                .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });

            await expect(uploadTitleCrew(filePath)).rejects.toThrow('Error processing file or internal server error');
        });
    });

    describe('uploadTitleEpisode', () => {
        const baseURL = 'https://localhost:9876/ntuaflix_api';
        const token = 'validAdminToken123';
        const filePath = '/path/to/file.tsv';

        beforeEach(() => {
            nock.cleanAll();
            getToken.mockReturnValue(token); // Assume a valid token is always returned
            fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
        });

        it('successfully uploads title episode data', async () => {
            const mockResponse = { message: 'File processed and data inserted successfully' };

            nock(baseURL)
                .post('/admin/upload/titleepisode')
                .matchHeader('x-observatory-auth', token)
                .reply(200, mockResponse);

            const response = await uploadTitleEpisode(filePath);
            expect(response).toEqual(mockResponse);
        });

        it('throws an error for no file uploaded or wrong file type', async () => {
            nock(baseURL)
                .post('/admin/upload/titleepisode')
                .matchHeader('x-observatory-auth', token)
                .reply(400, { message: 'No file uploaded or wrong file type uploaded' });

            await expect(uploadTitleEpisode(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
        });

        it('throws an error if no token is found', async () => {
            getToken.mockReturnValue(null);

            await expect(uploadTitleEpisode(filePath)).rejects.toThrow('No token found');
        });

        it('throws an error for unauthorized access', async () => {
            getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

            nock(baseURL)
                .post('/admin/upload/titleepisode')
                .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

            await expect(uploadTitleEpisode(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
        });

        it('handles server error during file upload', async () => {
            nock(baseURL)
                .post('/admin/upload/titleepisode')
                .matchHeader('x-observatory-auth', token)
                .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });

            await expect(uploadTitleEpisode(filePath)).rejects.toThrow('Error processing file or internal server error');
        });
    });

    describe('uploadTitlePrincipals', () => {
        const baseURL = 'https://localhost:9876/ntuaflix_api';
        const token = 'validAdminToken123';
        const filePath = '/path/to/file.tsv';

        beforeEach(() => {
            nock.cleanAll();
            getToken.mockReturnValue(token); // Assume a valid token is always returned
            fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
        });

        it('successfully uploads title principals data', async () => {
            const mockResponse = { message: 'File processed and data inserted successfully' };

            nock(baseURL)
                .post('/admin/upload/titleprincipals')
                .matchHeader('x-observatory-auth', token)
                .reply(200, mockResponse);

            const response = await uploadTitlePrincipals(filePath);
            expect(response).toEqual(mockResponse);
        });

        it('throws an error for no file uploaded or wrong file type', async () => {
            nock(baseURL)
                .post('/admin/upload/titleprincipals')
                .matchHeader('x-observatory-auth', token)
                .reply(400, { message: 'No file uploaded or wrong file type uploaded' });

            await expect(uploadTitlePrincipals(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
        });

        it('throws an error if no token is found', async () => {
            getToken.mockReturnValue(null);

            await expect(uploadTitlePrincipals(filePath)).rejects.toThrow('No token found');
        });

        it('throws an error for unauthorized access', async () => {
            getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

            nock(baseURL)
                .post('/admin/upload/titleprincipals')
                .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

            await expect(uploadTitlePrincipals(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
        });

        it('handles server error during file upload', async () => {
            nock(baseURL)
                .post('/admin/upload/titleprincipals')
                .matchHeader('x-observatory-auth', token)
                .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });

            await expect(uploadTitlePrincipals(filePath)).rejects.toThrow('Error processing file or internal server error');
        });

    });

    describe('uploadTitleRatings', () => {
        const baseURL = 'https://localhost:9876/ntuaflix_api';
        const token = 'validAdminToken123';
        const filePath = '/path/to/file.tsv';

        beforeEach(() => {
            nock.cleanAll();
            getToken.mockReturnValue(token); // Assume a valid token is always returned
            fs.createReadStream.mockReturnValueOnce(new Buffer('file contents')); // Mock file read
        });

        it('successfully uploads title ratings data', async () => {
            const mockResponse = { message: 'File processed and data inserted successfully' };

            nock(baseURL)
                .post('/admin/upload/titleratings')
                .matchHeader('x-observatory-auth', token)
                .reply(200, mockResponse);

            const response = await uploadTitleRatings(filePath);
            expect(response).toEqual(mockResponse);
        });

        it('throws an error for no file uploaded or wrong file type', async () => {
            nock(baseURL)
                .post('/admin/upload/titleratings')
                .matchHeader('x-observatory-auth', token)
                .reply(400, { message: 'No file uploaded or wrong file type uploaded' });

            await expect(uploadTitleRatings(filePath)).rejects.toThrow('No file uploaded or wrong file type uploaded');
        });

        it('throws an error for unauthorized access', async () => {
            getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

            nock(baseURL)
                .post('/admin/upload/titleratings')
                .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

            await expect(uploadTitleRatings(filePath)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
        });

        it('handles server error during file upload', async () => {
            nock(baseURL)
                .post('/admin/upload/titleratings')
                .matchHeader('x-observatory-auth', token)
                .reply(500, { message: 'Error processing file or internal server error', error: 'Server unreachable' });

            await expect(uploadTitleRatings(filePath)).rejects.toThrow('Error processing file or internal server error');
        });
    });


  