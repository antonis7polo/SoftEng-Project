const nock = require('nock');
const { resetAll } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
}));

describe('resetAll', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validAdminToken123';
    
    beforeEach(() => {
      nock.cleanAll();
      getToken.mockReturnValue(token); // Assume a valid token is always returned
    });
  
    it('successfully resets the database', async () => {
      const mockResponse = { status: 'Database successfully reset' };
  
      nock(baseURL)
        .post('/admin/resetall')
        .matchHeader('x-observatory-auth', token)
        .reply(200, mockResponse);
  
      const response = await resetAll();
      expect(response).toEqual(mockResponse);
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);
  
        await expect(resetAll()).rejects.toThrow('No token found');
    });
  
    it('throws an error for unauthorized access', async () => {
      getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token
      
      nock(baseURL)
        .post('/admin/resetall')
        .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });
  
      await expect(resetAll()).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
    });
  
    it('handles server error during database reset', async () => {
      nock(baseURL)
        .post('/admin/resetall')
        .matchHeader('x-observatory-auth', token)
        .reply(500, { message: 'Failed to perform reset all operation'});
  
      await expect(resetAll()).rejects.toThrow('Failed to perform reset all operation');
    });
  });
  