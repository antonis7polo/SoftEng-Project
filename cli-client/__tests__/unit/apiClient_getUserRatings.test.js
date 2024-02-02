const nock = require('nock');
const { getToken } = require('../../src/utils/tokenStorage');
const { getUserRatings } = require('../../src/apiClient');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('getUserRatings', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const userID = '1';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves user ratings in JSON format', async () => {
        const mockResponse = {
            userID: "1",
            ratings: [
                {
                    titleID: "tt0000929",
                    rating: "8"
                },
                {
                    titleID: "tt0000930",
                    rating: "7"
                }
            ]
        };

        nock(baseURL)
            .get(`/ratings/${userID}`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        const response = await getUserRatings(userID, 'json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves user ratings in CSV format', async () => {
        const csvResponse = "titleID,rating\n" +
            "tt0000929,8\n" +
            "tt0000930,7";

        nock(baseURL)
            .get(`/ratings/${userID}`)
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        const response = await getUserRatings(userID, 'csv');
        expect(response).toEqual(csvResponse);
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .get(`/ratings/${userID}`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(401, { message: 'Unauthorized' });
        await expect(getUserRatings(userID, 'json')).rejects.toThrow('Unauthorized');
    });

    it('throws an error for server error', async () => {
        nock(baseURL)
            .get(`/ratings/${userID}`)
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(500, { message: 'Server error' });
        await expect(getUserRatings(userID, 'json')).rejects.toThrow('Server error');
    });

    it('throws an error for no token found', async () => {
        getToken.mockReturnValue(null);
        await expect(getUserRatings(userID, 'json')).rejects.toThrow('No token found');
    });
});
