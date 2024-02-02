jest.mock('../../src/apiClient', () => ({
    logout: jest.fn(),
}));

const { logout } = require('../../src/apiClient');
const { Command } = require('commander');
const logoutCommand = require('../../src/commands/logout');

describe('logoutCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      logoutCommand(program);
    });
  
    it('successfully logs out the user', async () => {
      logout.mockResolvedValue();
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'logout']);
  
      expect(logout).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Logout successful!');
    });
  
    it('handles error when logout fails', async () => {
      const errorMessage = 'Network error';
      logout.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'logout']);
  
      expect(console.error).toHaveBeenCalledWith('Logout failed:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });