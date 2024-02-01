const nock = require('nock');
const { login } = require('../../src/apiClient'); // Adjust path as necessary
const { storeToken } = require('../../src/utils/tokenStorage');

jest.mock('../../src/utils/tokenStorage', () => ({
  storeToken: jest.fn(),
}));

describe('login', () => {
  const baseURL = 'https://localhost:9876';
  const path = '/ntuaflix_api/login';

  beforeEach(() => {
    nock.cleanAll();
    storeToken.mockClear();
  });

  it('successfully logs in and stores token', async () => {
    const mockResponse = { token: 'fakeToken123', userID: 'user123' };

    nock(baseURL)
      .post(path, {
        username: 'validUser',
        password: 'validPassword',
      })
      .reply(200, mockResponse);

    const response = await login('validUser', 'validPassword');
    
    expect(response).toEqual(mockResponse);
    expect(storeToken).toHaveBeenCalledWith('fakeToken123');
  });

  it('throws an error with invalid credentials', async () => {
    nock(baseURL)
      .post(path, {
        username: 'invalidUser',
        password: 'wrongPassword',
      })
      .reply(401, { message: 'Invalid username or password' });

    await expect(login('invalidUser', 'wrongPassword'))
      .rejects
      .toThrow('Invalid username or password');
    expect(storeToken).not.toHaveBeenCalled();
  });

  it('throws a "No response was received from the API" error on network issues', async () => {
    nock(baseURL)
      .post(path)
      .replyWithError('No response was received from the API');

    await expect(login('anyUser', 'anyPassword'))
      .rejects
      .toThrow('No response was received from the API');
    expect(storeToken).not.toHaveBeenCalled();
  });

  it('throws a detailed server error message on 500 response', async () => {
    nock(baseURL)
      .post(path)
      .reply(500, { message: 'Server error', error: 'Database unreachable' });

    await expect(login('testuser', 'password123'))
      .rejects
      .toThrow('Server error');
    expect(storeToken).not.toHaveBeenCalled();
  });
});
