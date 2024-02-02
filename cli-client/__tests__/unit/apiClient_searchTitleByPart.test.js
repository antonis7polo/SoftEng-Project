const nock = require('nock');
const { searchTitleByPart } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('searchTitleByPart', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const titlePart = 'Klebolin';

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
            .get('/searchtitle', { titlePart })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        const response = await searchTitleByPart(titlePart, 'json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves title information in CSV format', async () => {
        const csvResponse = "titleID,type,originalTitle,titlePoster,startYear,endYear,genres,titleAkas,principals,rating\n" +
            "tt0000929,short,Klebolin klebt alles,,1990,,Comedy,Short,Willys Streiche: Klebolin klebt alles,DE,Klebolin klebt alles,,DE,Ernst Behmer,nm0066941,actor,Victor Colani,nm0170183,actor,5.30,46";

        nock(baseURL)
            .get('/searchtitle', { titlePart })
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse, { 'Content-Type': 'text/csv' });

        const response = await searchTitleByPart(titlePart, 'csv');
        expect(response).toBe(csvResponse);
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);

        await expect(searchTitleByPart(titlePart)).rejects.toThrow('No token found');
    });

    it('throws an error for unauthorized access', async () => {
        getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token

        nock(baseURL)
            .get('/searchtitle', { titlePart })
            .query({ format: 'json' })
            .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });

        await expect(searchTitleByPart(titlePart)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
    });

    it('throws an error for invalid title part', async () => {
        nock(baseURL)
            .get('/searchtitle', { titlePart })
            .query({ format: 'json' })
            .reply(400, { message: 'Invalid title part' });

        await expect(searchTitleByPart(titlePart)).rejects.toThrow('Invalid title part');
    });

    it('throws an error if no title is found', async () => {
        nock(baseURL)
            .get('/searchtitle', { titlePart: 'invalidTitle' })
            .query({ format: 'json' })
            .reply(404, { message: 'No title found' });

        await expect(searchTitleByPart('invalidTitle')).rejects.toThrow('No title found');
    });

    it('throws an error for internal server error', async () => {
        nock(baseURL)
            .get('/searchtitle', { titlePart })
            .query({ format: 'json' })
            .reply(500, { message: 'Internal server error' });

        await expect(searchTitleByPart(titlePart)).rejects.toThrow('Internal server error');
    });


});

