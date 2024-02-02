const nock = require('nock');
const { searchNameByPart } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('searchNameByPart', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const namePart = 'Woody';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves name information in JSON format', async () => {
        const mockResponse = {
            nameObject: {
                nameID: "nm0000095",
                name: "Woody Allen",
                namePoster: "https://image.tmdb.org/t/p/{width_variable}/wcPQgZLDibuej1RwNTy1R2U2ZJw.jpg",
                birthYr: "1935",
                deathYr: null,
                profession: "actor, director, writer",
                nameTitles: [
                    { titleID: "tt0099012", "category": "director" }
                ]
            }
        };

        nock(baseURL)
            .get('/searchname', { namePart })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        const response = await searchNameByPart(namePart, 'json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves name information in CSV format', async () => {
        const csvResponse = "nameID,name,namePoster,birthYr,deathYr,profession,nameTitles\n" +
            "nm0000095,Woody Allen,https://image.tmdb.org/t/p/{width_variable}/wcPQgZLDibuej1RwNTy1R2U2ZJw.jpg,1935,,actor, director, writer,tt0099012,director";
        nock(baseURL)
            .get('/searchname', { namePart })
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        const response = await searchNameByPart(namePart, 'csv');
        expect(response).toEqual(csvResponse);
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .get('/searchname', { namePart })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(401, { message: 'Unauthorized' });
        
        await expect(searchNameByPart(namePart, 'json')).rejects.toThrow('Unauthorized');
    });

    it('throws an error for bad request', async () => {
        nock(baseURL)
            .get('/searchname', { namePart })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(400, { message: 'Bad request' });
        
        await expect(searchNameByPart(namePart, 'json')).rejects.toThrow('Bad request');
    });

    it('returns an error message when the server returns a 404 status code', async () => {
        nock(baseURL)
            .get('/searchname', { namePart })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(404, { message: 'Name not found' });
        
        await expect(searchNameByPart(namePart, 'json')).rejects.toThrow('Name not found');
    });

    it('returns an error message when the server returns a 500 status code', async () => {
        nock(baseURL)
            .get('/searchname', { namePart })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(500, { message: 'Internal server error' });
        
        await expect(searchNameByPart(namePart, 'json')).rejects.toThrow('Internal server error');
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);

        await expect(searchNameByPart(namePart)).rejects.toThrow('No token found');
    });



});