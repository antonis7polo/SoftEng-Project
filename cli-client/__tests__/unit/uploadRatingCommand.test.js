jest.mock('../../src/apiClient', () => ({
    uploadUserRating: jest.fn(),
}));

const { uploadUserRating } = require('../../src/apiClient');
const { Command } = require('commander');
const uploadRatingCommand = require('../../src/commands/uploadrating');

describe('uploadRatingCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      uploadRatingCommand(program);
    });
  
    it('successfully uploads a rating', async () => {
      const mockUserID = '123';
      const mockTitleID = 'tt1234567';
      const mockRating = '8';
      const mockResponseMessage = 'Rating uploaded successfully';
      uploadUserRating.mockResolvedValue({ message: mockResponseMessage });
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'uploadrating', '--userid', mockUserID, '--titleid', mockTitleID, '--rating', mockRating]);
  
      expect(uploadUserRating).toHaveBeenCalledWith(mockUserID, mockTitleID, mockRating);
      expect(console.log).toHaveBeenCalledWith(mockResponseMessage);
    });
  
    it('handles invalid rating input', async () => {
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'uploadrating', '--userid', '123', '--titleid', 'tt1234567', '--rating', '11']);
  
      expect(console.error).toHaveBeenCalledWith('Invalid rating. Please enter a number between 1 and 10.');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  
    it('handles error when uploading rating fails', async () => {
      const errorMessage = 'Failed to upload rating';
      uploadUserRating.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'uploadrating', '--userid', '123', '--titleid', 'tt1234567', '--rating', '5']);
  
      expect(uploadUserRating).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Failed to upload rating:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });