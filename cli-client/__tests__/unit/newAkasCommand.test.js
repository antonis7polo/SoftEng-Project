jest.mock('fs', () => ({
    existsSync: jest.fn(),
}));

jest.mock('../../src/apiClient', () => ({
    uploadTitleAkas: jest.fn(),
}));

const fs = require('fs');
const { uploadTitleAkas } = require('../../src/apiClient');
const { Command } = require('commander');
const newAkasCommand = require('../../src/commands/newakas');

describe('newAkasCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      newAkasCommand(program);
    });
  
    it('successfully uploads a file', async () => {
      const mockFilename = '/path/to/akas.tsv';
      fs.existsSync.mockReturnValue(true);
      const mockResult = { message: 'Upload successful' };
      uploadTitleAkas.mockResolvedValue(mockResult);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'newakas', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(uploadTitleAkas).toHaveBeenCalledWith(mockFilename);
      expect(console.log).toHaveBeenCalledWith('File uploaded successfully:', mockResult.message);
    });
  
    it('reports file not found', async () => {
      const mockFilename = '/path/not/found.tsv';
      fs.existsSync.mockReturnValue(false);
  
      console.error = jest.fn(); // Mock console.error to capture output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'newakas', '--filename', mockFilename]);
  
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilename);
      expect(console.error).toHaveBeenCalledWith('File not found:', mockFilename);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  
    it('handles error when upload fails', async () => {
      const mockFilename = '/path/to/fail.tsv';
      fs.existsSync.mockReturnValue(true);
      const errorMessage = 'Network error';
      uploadTitleAkas.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'newakas', '--filename', mockFilename]);
  
      expect(uploadTitleAkas).toHaveBeenCalledWith(mockFilename);
      expect(console.error).toHaveBeenCalledWith('Failed to upload file:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });