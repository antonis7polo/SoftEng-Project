const nock = require('nock');
const { healthCheck } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
}));

describe('healthCheck', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validAdminToken123';
    
    beforeEach(() => {
      nock.cleanAll();
      getToken.mockReturnValue(token); // Assume a valid token is always returned
    });
  
    it('successfully performs health check in JSON format', async () => {
      const mockResponse = {
        status: 'OK',
        dataconnection: ['Server=localhost', 'Database=imdb;', 'Username=root', 'Password=root']
      };
  
      nock(baseURL)
        .get('/admin/healthcheck')
        .query({ format: 'json' })
        .matchHeader('x-observatory-auth', token)
        .reply(200, mockResponse);
  
      const response = await healthCheck('json');
      expect(response).toEqual(mockResponse);
    });
  
    it('successfully performs health check in CSV format', async () => {
      const csvResponse = "status, dataconnection\nOK, Server=...; Database=...; Username=...; Password=...";
      
      nock(baseURL)
        .get('/admin/healthcheck')
        .query({ format: 'csv' })
        .matchHeader('x-observatory-auth', token)
        .reply(200, csvResponse, { 'Content-Type': 'text/csv' });
  
      const response = await healthCheck('csv');
      expect(response).toBe(csvResponse);
    });

    it('throws an error if no token is found', async () => {
        getToken.mockReturnValue(null);
  
        await expect(healthCheck()).rejects.toThrow('No token found');
    }); 
  
    it('throws an error for unauthorized access', async () => {
      getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token
      
      nock(baseURL)
        .get('/admin/healthcheck')
        .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });
  
      await expect(healthCheck()).rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
    });
  
    it('handles server error during health check', async () => {
      nock(baseURL)
        .get('/admin/healthcheck')
        .matchHeader('x-observatory-auth', token)
        .reply(500, { message: 'Failed to perform health check' });

        await expect(healthCheck()).rejects.toThrow('Failed to perform health check');

    
    });
  
});