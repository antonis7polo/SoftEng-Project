jest.mock('../../src/apiClient', () => ({
    deleteUserRating: jest.fn(),
}));

const { deleteUserRating } = require('../../src/apiClient');
const { Command } = require('commander');
const deleteRatingCommand = require('../../src/commands/deleterating');

describe('deleteRatingCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      deleteRatingCommand(program);
    });
  
    it('successfully deletes a user rating', async () => {
      const mockResult = { message: 'Rating deleted successfully' };
      deleteUserRating.mockResolvedValue(mockResult);
  
      console.log = jest.fn(); // Mock console.log to verify output
  
      await program.parseAsync(['node', 'test', 'deleterating', '--userid', '1', '--titleid', 'tt0000001']);
  
      expect(deleteUserRating).toHaveBeenCalledWith('1', 'tt0000001');
      expect(console.log).toHaveBeenCalledWith(mockResult.message);
    });
  
    it('handles error when deleting a rating fails', async () => {
      const errorMessage = 'Error deleting rating';
      deleteUserRating.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to verify error output
      process.exit = jest.fn(); // Mock process.exit to prevent the test process from exiting
  
      await program.parseAsync(['node', 'test', 'deleterating', '--userid', '1', '--titleid', 'tt0000001']);
  
      expect(console.error).toHaveBeenCalledWith('Failed to delete rating:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });