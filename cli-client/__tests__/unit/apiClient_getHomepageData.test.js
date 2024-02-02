const nock = require('nock');
const { getToken } = require('../../src/utils/tokenStorage');
const { getHomepageData } = require('../../src/apiClient');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('getHomepageData', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves homepage data in JSON format', async () => {
        const mockResponse = {
            data: {
                topRatedMovies: [
                    {titleID: "tt0000929"}, {titleID: "tt0000930"}, {titleID: "tt0000931"}
                ],
                newReleases: [
                    {titleID: "tt0000932"}, {titleID: "tt0000933"}, {titleID: "tt0000934"}
                ],
                popularInAction: [
                    {titleID: "tt0000935"}, {titleID: "tt0000936"}, {titleID: "tt0000937"}
                ]
            }
        };

        nock(baseURL)
            .get('/home')
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        
        const response = await getHomepageData('json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves homepage data in CSV format', async () => {
        const csvResponse = "topRatedMovies,newReleases,popularInAction\n" +
            "tt0000929;tt0000930;tt0000931,tt0000932;tt0000933;tt0000934,tt0000935;tt0000936;tt0000937";
        nock(baseURL)
            .get('/home')
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        const response = await getHomepageData('csv');
        expect(response).toEqual(csvResponse);
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .get('/home')
            .query({ format: 'json' })
            .reply(401, { message: 'Unauthorized access' });

        await expect(getHomepageData('json')).rejects.toThrow('Unauthorized access');
    });

    it('throws an error for internal server error', async () => {
        nock(baseURL)
            .get('/home')
            .query({ format: 'json' })
            .reply(500, { message: 'Internal server error' });

        await expect(getHomepageData('json')).rejects.toThrow('Internal server error');
    });

    it('throws an error for no token found', async () => {
        getToken.mockReturnValue(null);

        await expect(getHomepageData('json')).rejects.toThrow('No token found');
    });
});