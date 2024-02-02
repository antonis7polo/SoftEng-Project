jest.mock('fs', () => ({
    existsSync: jest.fn(),
}));

jest.mock('../../src/apiClient', () => ({
    uploadTitleRatings: jest.fn(),
}));

const fs = require('fs');
const { uploadTitleRatings } = require('../../src/apiClient');
const { Command } = require('commander');
const newRatingsCommand = require('../../src/commands/newratings');

describe('newRatingsCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      newRatingsCommand(program);
    });
  
    it('successfully uploads a file', async () => {
      const mockFilename = '/path/to/ratings.tsv';
      fs.existsSync.mockReturnValue(true);
      const mockResult = { message: 'Upload successful' };
      uploadTitleRatings.mockResolvedValue(mockResult);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'newratings', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(uploadTitleRatings).toHaveBeenCalledWith(mockFilename);
      expect(console.log).toHaveBeenCalledWith('File uploaded successfully:', mockResult.message);
    });
  
    it('reports file not found', async () => {
      const mockFilename = '/path/not/found.tsv';
      fs.existsSync.mockReturnValue(false);
  
      console.error = jest.fn(); // Mock console.error to capture output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'newratings', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(console.error).toHaveBeenCalledWith('File not found:', mockFilename);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  
    it('handles error when upload fails', async () => {
      const mockFilename = '/path/to/fail.tsv';
      fs.existsSync.mockReturnValue(true);
      const errorMessage = 'Network error';
      uploadTitleRatings.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'newratings', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(console.error).toHaveBeenCalledWith('Failed to upload file:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });