const nock = require('nock');
const { getToken } = require('../../src/utils/tokenStorage');
const { getTitleDetails } = require('../../src/apiClient');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('getTitleDetails', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const titleID = 'tt0000929';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves title information in JSON format', async () => {
        const mockResponse = {
            titleDetails: {
                titleID: "tt0000929",
                genres: [
                    { genreTitle: "Comedy" },
                    { genreTitle: "Short" }
                ],
                leadActors: [
                    { nameID: "nm0066941" },
                    { nameID: "nm0170183" }
                ],
                directors: [{nameid: "nm0000001"}]
            }
        };

        nock(baseURL)
            .get(`/titles/${titleID}/details`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);

        const response = await getTitleDetails(titleID, 'json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves title information in CSV format', async () => {
        const csvResponse = "titleID,genres,leadActors,directors\n" +
            "tt0000929,Comedy;Short,nm0066941;nm0170183,nm0000001";
        nock(baseURL)
            .get(`/titles/${titleID}/details`)
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        const response = await getTitleDetails(titleID, 'csv');
        expect(response).toEqual(csvResponse);
    });

    it('returns 404 when titleID is not found', async () => {
        nock(baseURL)
            .get(`/titles/${titleID}/details`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(404, { message: 'Title not found' });
        await expect(getTitleDetails(titleID, 'json')).rejects.toThrow('Title not found');
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .get(`/titles/${titleID}/details`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(401, { message: 'Unauthorized access' });
        await expect(getTitleDetails(titleID, 'json')).rejects.toThrow('Unauthorized access');
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);
        await expect(getTitleDetails(titleID)).rejects.toThrow('No token found');
    });

    it('throws an error for server error', async () => {
        nock(baseURL)
            .get(`/titles/${titleID}/details`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(500, { message: 'Internal server error' });
        await expect(getTitleDetails(titleID, 'json')).rejects.toThrow('Internal server error');
    });

});