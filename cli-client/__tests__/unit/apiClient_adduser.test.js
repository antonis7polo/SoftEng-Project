const nock = require('nock');
const { addUser } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
  clearToken: jest.fn(),
}));

describe('addUser', () => {
    const baseURL = 'https://localhost:9876';
    const token = 'validAdminToken123';
    const path = '/ntuaflix_api/admin/usermod/';
    const userCredentials = { username: 'newUser', password: 'newPassword', email: 'new@user.com', isAdmin: '1' };
  
    beforeEach(() => {
      nock.cleanAll();
      getToken.mockReturnValue(token);
    });
  
    it('successfully creates or updates a user', async () => {
      nock(baseURL)
        .post(`${path}${userCredentials.username}/${userCredentials.password}`, {
          email: userCredentials.email,
          isAdmin: userCredentials.isAdmin,
        })
        .matchHeader('x-observatory-auth', token)
        .reply(200, { message: 'User created or updated successfully' });
  
      await expect(addUser(userCredentials.username, userCredentials.password, userCredentials.email, userCredentials.isAdmin))
        .resolves.toEqual({ message: 'User created or updated successfully' });
    });
  
    it('throws an error for missing or invalid fields', async () => {
      nock(baseURL)
        .post(`${path}${userCredentials.username}/${userCredentials.password}`, {
          email: userCredentials.email,
        })
        .matchHeader('x-observatory-auth', token)
        .reply(400, { message: 'Missing or invalid required fields' });
  
      await expect(addUser(userCredentials.username, userCredentials.password, userCredentials.email))
        .rejects.toThrow('Missing or invalid required fields');
    });

    it('throws an error for invalid fields', async () => {
        nock(baseURL)
          .post(`${path}${userCredentials.username}/${userCredentials.password}`, {
            email: userCredentials.email,
            isAdmin: 'foo',
          })
          .matchHeader('x-observatory-auth', token)
          .reply(400, { message: 'Missing or invalid required fields' });
    
        await expect(addUser(userCredentials.username, userCredentials.password, userCredentials.email, 'foo'))
          .rejects.toThrow('Missing or invalid required fields');
      });

    it('throws an error if no token is found', async () => {
      getToken.mockReturnValue(null);

      await expect(addUser(userCredentials.username, userCredentials.password, userCredentials.email, userCredentials.isAdmin)).rejects.toThrow('No token found');
    });
  
    it('throws an error for unauthorized access', async () => {
      getToken.mockReturnValueOnce('invalidToken'); // Simulate invalid token
  
      nock(baseURL)
        .post(`${path}${userCredentials.username}/${userCredentials.password}`, {
            email: userCredentials.email,
            isAdmin: userCredentials.isAdmin,
        })
        .reply(401, { message: 'Unauthorized - Token not provided, invalid, or user is not an admin' });
  
      await expect(addUser(userCredentials.username, userCredentials.password, userCredentials.email, userCredentials.isAdmin))
        .rejects.toThrow('Unauthorized - Token not provided, invalid, or user is not an admin');
    });
  
    it('handles server error during user modification', async () => {
      nock(baseURL)
        .post(`${path}${userCredentials.username}/${userCredentials.password}`,{
            email: userCredentials.email,
            isAdmin: userCredentials.isAdmin,
        })
        .matchHeader('x-observatory-auth', token)
        .reply(500, { message: 'Internal server error during user modification', error: 'Database unreachable' });
  
      await expect(addUser(userCredentials.username, userCredentials.password, userCredentials.email, userCredentials.isAdmin))
        .rejects.toThrow('Internal server error during user modification');
    });
  });
  