jest.mock('../../src/apiClient', () => ({
    resetAll: jest.fn(),
}));

const { resetAll } = require('../../src/apiClient');
const { Command } = require('commander');
const resetAllCommand = require('../../src/commands/resetall');

describe('resetAllCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      resetAllCommand(program);
    });
  
    it('successfully resets all data', async () => {
      const mockResult = { status: 'OK' };
      resetAll.mockResolvedValue(mockResult);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'resetall']);
  
      expect(resetAll).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Reset all operation successful:', mockResult.status);
    });
  
    it('handles error when reset fails', async () => {
      const errorMessage = 'Network error';
      resetAll.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'resetall']);
  
      expect(console.error).toHaveBeenCalledWith('Reset all operation failed:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });