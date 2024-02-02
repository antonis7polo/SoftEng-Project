const nock = require('nock');
const { getTitlesByGenre } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('getTitlesByGenre', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const qgenre = 'Comedy';
    const minrating = '5';
    const yrFrom = '1990';
    const yrTo = '2000';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves title information in JSON format', async () => {
        const mockResponse = {
            titleObject: {
                titleID: "tt0000929",
                type: "short",
                originalTitle: "Klebolin klebt alles",
                titlePoster: null,
                startYear: "1990",
                endYear: null,
                genres: [
                    { genreTitle: "Comedy" },
                    { genreTitle: "Short" }
                ],
                titleAkas: [
                    { akaTitle: "Willys Streiche: Klebolin klebt alles", regionAbbrev: "DE" },
                    { akaTitle: "Klebolin klebt alles", regionAbbrev: null },
                    { akaTitle: "Klebolin klebt alles", regionAbbrev: "DE" }
                ],
                principals: [
                    { nameID: "nm0066941", name: "Ernst Behmer", category: "actor" },
                    { nameID: "nm0170183", name: "Victor Colani", category: "actor"}
                ],
                rating: {
                    avRating: "5.30",
                    nVotes: "46"
                }
            }
        };

        nock(baseURL)
            .get('/bygenre', { qgenre, minrating, yrFrom, yrTo })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        
        const response = await getTitlesByGenre(qgenre, minrating, yrFrom, yrTo, 'json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves title information in CSV format', async () => {
        const csvResponse = "titleID,type,originalTitle,titlePoster,startYear,endYear,genres,titleAkas,principals,rating\n" +
            "tt0000929,short,Klebolin klebt alles,,1990,,Comedy,Short,Willys Streiche: Klebolin klebt alles,DE,Klebolin klebt alles,,DE,Ernst Behmer,nm0066941,actor,Victor Colani,nm0170183,actor,5.30,46";

        nock(baseURL)
            .get('/bygenre', { qgenre, minrating, yrFrom, yrTo })
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        
        const response = await getTitlesByGenre(qgenre, minrating, yrFrom, yrTo, 'csv');
        expect(response).toEqual(csvResponse);
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);

        await expect(getTitlesByGenre(qgenre, minrating, yrFrom, yrTo, 'json')).rejects.toThrow('No token found');
    });

    it('returns 401 when token is invalid', async () => {
        getToken.mockReturnValue('invalidToken123');

        nock(baseURL)
            .get('/bygenre', { qgenre, minrating, yrFrom, yrTo })
            .query({ format: 'json' })
            .reply(401, {message: 'Invalid token'});
        
        await expect(getTitlesByGenre(qgenre, minrating, yrFrom, yrTo, 'json')).rejects.toThrow('Invalid token');
    });

    it('returns 400 when genre is not provided', async () => {
        nock(baseURL)
            .get('/bygenre', { minrating, yrFrom, yrTo })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(400,{message: 'Genre not provided'});
        
        await expect(getTitlesByGenre(undefined, minrating, yrFrom, yrTo, 'json')).rejects.toThrow('Genre not provided');
    });

    it('returns 400 when minrating is not provided', async () => {
        nock(baseURL)
            .get('/bygenre', { qgenre, yrFrom, yrTo })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(400, {message: 'Minimum rating not provided'});
        
        await expect(getTitlesByGenre(qgenre, undefined, yrFrom, yrTo, 'json')).rejects.toThrow('Minimum rating not provided');
    });

    it('returns 404 when no titles are found', async () => {
        nock(baseURL)
            .get('/bygenre', { qgenre, minrating, yrFrom, yrTo })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(404, {message: 'No titles found'});
        
        await expect(getTitlesByGenre(qgenre, minrating, yrFrom, yrTo, 'json')).rejects.toThrow('No titles found');
    });

    it('returns 500 when server error occurs', async () => {
        nock(baseURL)
            .get('/bygenre', { qgenre, minrating, yrFrom, yrTo })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(500, {message: 'Internal server error'});
        
        await expect(getTitlesByGenre(qgenre, minrating, yrFrom, yrTo, 'json')).rejects.toThrow('Internal server error');
    });

    
});
