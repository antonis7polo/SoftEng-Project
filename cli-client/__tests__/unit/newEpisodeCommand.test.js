jest.mock('fs', () => ({
    existsSync: jest.fn(),
}));

jest.mock('../../src/apiClient', () => ({
    uploadTitleEpisode: jest.fn(),
}));

const fs = require('fs');
const { uploadTitleEpisode } = require('../../src/apiClient');
const { Command } = require('commander');
const newEpisodeCommand = require('../../src/commands/newepisode');

describe('newEpisodeCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      newEpisodeCommand(program);
    });
  
    it('successfully uploads a file', async () => {
      const mockFilename = '/path/to/episode.mp4';
      fs.existsSync.mockReturnValue(true);
      const mockResult = { message: 'Upload successful' };
      uploadTitleEpisode.mockResolvedValue(mockResult);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'newepisode', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(uploadTitleEpisode).toHaveBeenCalledWith(mockFilename);
      expect(console.log).toHaveBeenCalledWith('File uploaded successfully:', mockResult.message);
    });
  
    it('reports file not found', async () => {
      const mockFilename = '/path/not/found.mp4';
      fs.existsSync.mockReturnValue(false);
  
      console.error = jest.fn(); // Mock console.error to capture output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'newepisode', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(console.error).toHaveBeenCalledWith('File not found:', mockFilename);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  
    it('handles error when upload fails', async () => {
      const mockFilename = '/path/to/fail.mp4';
      fs.existsSync.mockReturnValue(true);
      const errorMessage = 'Network error';
      uploadTitleEpisode.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'newepisode', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(uploadTitleEpisode).toHaveBeenCalledWith(mockFilename);
      expect(console.error).toHaveBeenCalledWith('Failed to upload file:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
