jest.mock('../../src/apiClient', () => ({
    addUser: jest.fn(),
}));

const { addUser } = require('../../src/apiClient');
const { Command } = require('commander');
const addUserCommand = require('../../src/commands/adduser');

describe('addUserCommand', () => {
    let program;
  
    beforeEach(() => {
      // Reset mocks and create a new Command instance for each test
      jest.clearAllMocks();
      program = new Command();
      addUserCommand(program); // Attach the command to the program
    });
  
    it('successfully adds a user', async () => {
      const mockUsername = 'testUser';
      const mockPassword = 'testPass';
      const mockEmail = 'test@example.com';
      const mockIsAdmin = '1';
      
      // Mock the addUser function to resolve successfully
      addUser.mockResolvedValue();
  
      // Mock console.log to verify output
      console.log = jest.fn();
  
      // Simulate running the command
      await program.parseAsync(['node', 'test', 'adduser', '--username', mockUsername, '--passw', mockPassword, '--email', mockEmail, '--isAdmin', mockIsAdmin]);
  
      // Check that addUser was called with the correct arguments
      expect(addUser).toHaveBeenCalledWith(mockUsername, mockPassword, mockEmail, mockIsAdmin);
      
      // Verify console output
      expect(console.log).toHaveBeenCalledWith('User added/updated successfully.');
    });
  
    it('handles error when adding a user fails', async () => {
      // Mock the addUser function to throw an error
      const errorMessage = 'Failed to add user';
      addUser.mockRejectedValue(new Error(errorMessage));
  
      // Mock console.error to verify output
      console.error = jest.fn();
  
      // Mock process.exit to prevent the test process from exiting
      process.exit = jest.fn();
  
      // Simulate running the command and expect it to handle the error
      await program.parseAsync(['node', 'test', 'adduser', '--username', 'failUser', '--passw', 'failPass', '--email', 'fail@example.com', '--isAdmin', '0']);
  
      // Verify error handling
      expect(console.error).toHaveBeenCalledWith('Failed to add/update user:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
  