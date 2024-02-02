const nock = require('nock');
const { getUser } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
}));

describe('getUser', () => {
    const baseURL = 'https://localhost:9876';
    const token = 'validAdminToken123';
    const username = 'johndoe';
    
    beforeEach(() => {
      nock.cleanAll();
      getToken.mockReturnValue(token); // Assume valid token is always returned
    });
  
    it('successfully retrieves user information in JSON format', async () => {
      const mockResponse = {
        user: {
          username: 'johndoe',
          email: 'john@example.com',
          isAdmin: '1',
          created_at: '2021-01-01T12:00:00'
        }
      };
  
      nock(baseURL)
        .get(`/ntuaflix_api/admin/users/${username}`)
        .query({ format: 'json' })
        .matchHeader('x-observatory-auth', token)
        .reply(200, mockResponse);
  
      const response = await getUser(username, 'json');
      expect(response).toEqual(mockResponse);
    });
  
    it('successfully retrieves user information in CSV format', async () => {
      const csvResponse = "username,email,isAdmin,created_at\njohndoe,john@example.com,1,2021-01-01T12:00:00";
      
      nock(baseURL)
        .get(`/ntuaflix_api/admin/users/${username}`)
        .query({ format: 'csv' })
        .matchHeader('x-observatory-auth', token)
        .reply(200, csvResponse, { 'Content-Type': 'text/csv' });
  
      const response = await getUser(username, 'csv');
      expect(response).toBe(csvResponse);
    });

    it('throws an error if no token is found', async () => {
      getToken.mockReturnValue(null);

      await expect(getUser(username)).rejects.toThrow('No token found');
    });
  
    it('throws an error for unauthorized access', async () => {
      getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token
      
      nock(baseURL)
        .get(`/ntuaflix_api/admin/users/${username}`)
        .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });
  
      await expect(getUser(username)).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
    });
  
    it('throws an error if user not found', async () => {
      nock(baseURL)
        .get(`/ntuaflix_api/admin/users/${username}`)
        .reply(404, { message: 'User not found' });
  
      await expect(getUser(username)).rejects.toThrow('User not found');
    });
  
    it('handles server error during user retrieval', async () => {
      nock(baseURL)
        .get(`/ntuaflix_api/admin/users/${username}`)
        .reply(500, { message: 'Internal server error during user retrieval', error: 'Database unreachable' });
  
      await expect(getUser(username)).rejects.toThrow('Internal server error during user retrieval');
    });
  });
  