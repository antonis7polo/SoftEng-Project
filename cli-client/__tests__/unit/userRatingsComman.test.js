jest.mock('../../src/apiClient', () => ({
    getUserRatings: jest.fn(),
}));

const { getUserRatings } = require('../../src/apiClient');
const { Command } = require('commander');
const userRatingsCommand = require('../../src/commands/userratings');

describe('userRatingsCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      userRatingsCommand(program);
    });
  
    it('successfully retrieves user ratings and displays in JSON format', async () => {
      const mockUserID = '1';
      const mockRatingsData = {
        userID: "1",
        ratings: [
            {
                titleID: "tt0000929",
                rating: "8"
            },
            {
                titleID: "tt0000930",
                rating: "7"
            }
        ]
    };
      getUserRatings.mockResolvedValue(mockRatingsData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'userratings', '--userid', mockUserID]);
  
      expect(getUserRatings).toHaveBeenCalledWith(mockUserID, 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockRatingsData, null, 2));
    });
  
    it('successfully retrieves user ratings and displays in CSV format', async () => {
      const mockUserID = '1';
      const mockRatingsCSV = "titleID,rating\n" +
      "tt0000929,8\n" +
      "tt0000930,7";

      getUserRatings.mockResolvedValue(mockRatingsCSV);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'userratings', '--userid', mockUserID, '--format', 'csv']);
  
      expect(getUserRatings).toHaveBeenCalledWith(mockUserID, 'csv');
      expect(console.log).toHaveBeenCalledWith(mockRatingsCSV);
    });
  
    it('handles error when retrieving user ratings fails', async () => {
      const mockUserID = 'invalid_user';
      const errorMessage = 'Error retrieving user ratings';
      getUserRatings.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'userratings', '--userid', mockUserID]);
  
      expect(getUserRatings).toHaveBeenCalledWith(mockUserID, 'json'); // Default format is json
      expect(console.error).toHaveBeenCalledWith('Error retrieving user ratings:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });