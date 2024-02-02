const nock = require('nock');
const { logout } = require('../../src/apiClient'); 
const { getToken, clearToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
  clearToken: jest.fn(),
}));

describe('logout', () => {
  const baseURL = 'https://localhost:9876';
  const path = '/ntuaflix_api/logout';
  const token = 'validToken123';

  beforeEach(() => {
    nock.cleanAll();
    getToken.mockClear();
    clearToken.mockClear();
    getToken.mockReturnValue(token); // Simulate a valid token being available
  });

  it('successfully logs out', async () => {
    nock(baseURL)
      .post(path, {}, {
        reqheaders: {
          'x-observatory-auth': token,
        },
      })
      .reply(200);

    await logout();

    expect(clearToken).toHaveBeenCalled(); // Verify that the token was cleared after logout
  });

  it('throws an error when no token is found', async () => {
    getToken.mockReturnValueOnce(null); // Simulate no token being available

    await expect(logout()).rejects.toThrow('No token found. You are not logged in.');
    expect(clearToken).not.toHaveBeenCalled(); // Token clearing should not be attempted
  });

  it('throws an error if no token is found', async () => {
    getToken.mockReturnValue(null);

    await expect(logout()).rejects.toThrow('No token found');
  });

  it('throws an error for unauthorized logout attempt', async () => {
    nock(baseURL)
      .post(path, {}, {
        reqheaders: {
          'x-observatory-auth': 'invalidToken',
        },
      })
      .reply(401, { message: 'Unauthorized - No token provided or token is invalid' });

    await expect(logout()).rejects.toThrow('Unauthorized - No token provided or token is invalid');
    // Verify that the token is still cleared, as the function does this in a finally block
    expect(clearToken).toHaveBeenCalled();
  });

  it('handles server error during logout', async () => {
    nock(baseURL)
      .post(path, {}, {
        reqheaders: {
          'x-observatory-auth': token,
        },
      })
      .reply(500, { message: 'Server error', error: 'Database unreachable' });

    await expect(logout()).rejects.toThrow('Server error');
    // Verify that the token is cleared even in case of server error
    expect(clearToken).toHaveBeenCalled();
  });
});
