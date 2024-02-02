const nock = require('nock');
const { uploadUserRating } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('uploadUserRating', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const userID = '1';
    const titleID = 'tt0000929';
    const userRating = '8';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully uploads user rating', async () => {
        const mockResponse = {
            message: "Rating uploaded successfully"
        };

        nock(baseURL)
            .post(`/uploadrating`, { userID, titleID, userRating})
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        const response = await uploadUserRating(userID, titleID, userRating);
        expect(response).toEqual(mockResponse);
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .post(`/uploadrating`, { userID, titleID, userRating})
            .matchHeader('x-observatory-auth', token)
            .reply(401, { message: 'Unauthorized' });
        await expect(uploadUserRating(userID, titleID, userRating)).rejects.toThrow('Unauthorized');
    });

    it('throws an error for invalid user rating', async () => {
        nock(baseURL)
            .post(`/uploadrating`, { userID, titleID, userRating})
            .matchHeader('x-observatory-auth', token)
            .reply(400, { message: 'Invalid user rating' });
        await expect(uploadUserRating(userID, titleID, userRating)).rejects.toThrow('Invalid user rating');
    });

    it('throws an error for server error', async () => {
        nock(baseURL)
            .post(`/uploadrating`, { userID, titleID, userRating})
            .matchHeader('x-observatory-auth', token)
            .reply(500, { message: 'Server error' });
        await expect(uploadUserRating(userID, titleID, userRating)).rejects.toThrow('Server error');
    });

    it('throws an error for no token found', async () => { 
        getToken.mockReturnValue(null);
        await expect(uploadUserRating(userID, titleID, userRating)).rejects.toThrow('No token found');
    });
});

        

