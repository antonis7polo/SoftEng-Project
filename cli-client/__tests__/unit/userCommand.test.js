jest.mock('../../src/apiClient', () => ({
    getUser: jest.fn(),
}));

const { getUser } = require('../../src/apiClient');
const { Command } = require('commander');
const userCommand = require('../../src/commands/users');

describe('userCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      userCommand(program);
    });
  
    it('successfully retrieves user details and displays in JSON format', async () => {
      const mockUsername = 'testUser';
      const mockUserData = {
        username: mockUsername,
        password: 'testPassword',
        email: 'test@example.com',
        isAdmin: '0',
      };
      getUser.mockResolvedValue(mockUserData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'user', '--username', mockUsername, '--format', 'json']);
  
      expect(getUser).toHaveBeenCalledWith(mockUsername, 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockUserData, null, 2));
    });
  
    it('successfully retrieves user details and displays in CSV format', async () => {
      const mockUsername = 'testUserCSV';
      const mockUserDataCSV = 'username,password,email,isAdmin\ntestUserCSV,testPassword,test@example.com,false';
      getUser.mockResolvedValue(mockUserDataCSV);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'user', '--username', mockUsername, '--format', 'csv']);
  
      expect(getUser).toHaveBeenCalledWith(mockUsername, 'csv');
      expect(console.log).toHaveBeenCalledWith(mockUserDataCSV);
    });
  
    it('handles error when retrieving user details fails', async () => {
      const mockUsername = 'invalidUser';
      const errorMessage = 'User not found';
      getUser.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'user', '--username', mockUsername]);
  
      expect(getUser).toHaveBeenCalledWith(mockUsername, 'json'); // Default format is json
      expect(console.error).toHaveBeenCalledWith('Error:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });