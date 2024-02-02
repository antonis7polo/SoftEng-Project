const nock = require('nock');
const { getToken } = require('../../src/utils/tokenStorage');
const { deleteUserRating } = require('../../src/apiClient');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('deleteUserRating', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const userID = '1';
    const titleID = 'tt0000929';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully deletes user rating', async () => {
        nock(baseURL)
            .delete(`/ratings/${userID}/${titleID}`)
            .matchHeader('x-observatory-auth', token)
            .reply(200, 'Rating deleted successfully');

        const response = await deleteUserRating(userID, titleID);
        expect(response).toEqual('Rating deleted successfully');

    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .delete(`/ratings/${userID}/${titleID}`)
            .matchHeader('x-observatory-auth', token)
            .reply(401, { message: 'Unauthorized access' });
        await expect(deleteUserRating(userID, titleID)).rejects.toThrow('Unauthorized access');
    });

    it('throws an error for non-existent rating', async () => {
        nock(baseURL)
            .delete(`/ratings/${userID}/${titleID}`)
            .matchHeader('x-observatory-auth', token)
            .reply(404, { message: 'Rating not found' });
        await expect(deleteUserRating(userID, titleID)).rejects.toThrow('Rating not found');
    });

    it('throws an error for server error', async () => {
        nock(baseURL)
            .delete(`/ratings/${userID}/${titleID}`)
            .matchHeader('x-observatory-auth', token)
            .reply(500, { message: 'Internal server error' });
        await expect(deleteUserRating(userID, titleID)).rejects.toThrow('Internal server error');
    });

    it('throws an error for no token found', async () => {
        getToken.mockReturnValue(null);
        await expect(deleteUserRating(userID, titleID)).rejects.toThrow('No token found');
    });

});
        

