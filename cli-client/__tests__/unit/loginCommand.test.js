jest.mock('../../src/apiClient', () => ({
    login: jest.fn(),
}));

const { login } = require('../../src/apiClient');
const { Command } = require('commander');
const loginCommand = require('../../src/commands/login');

describe('loginCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      loginCommand(program);
    });
  
    it('successfully authenticates and welcomes the user', async () => {
      const mockResult = { token: 'validToken', userID: '123'}
      login.mockResolvedValue(mockResult);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'login', '--username', 'testuser', '--passw', 'testpass']);
  
      expect(login).toHaveBeenCalledWith('testuser', 'testpass');
      expect(console.log).toHaveBeenCalledWith('Welcome to NTUAFLIX!');
      expect(console.log).toHaveBeenCalledWith('Your ID is:', mockResult.userID);
    });
  
    it('handles error when authentication fails', async () => {
      const errorMessage = 'Invalid credentials';
      login.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'login', '--username', 'wronguser', '--passw', 'wrongpass']);
  
      expect(console.error).toHaveBeenCalledWith('Login failed:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });