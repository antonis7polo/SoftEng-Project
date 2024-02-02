jest.mock('../../src/apiClient', () => ({
    healthCheck: jest.fn(),
}));

const { healthCheck } = require('../../src/apiClient');
const { Command } = require('commander');
const healthCheckCommand = require('../../src/commands/healthcheck');

describe('healthCheckCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      healthCheckCommand(program);
    });
  
    it('successfully performs a health check in JSON format', async () => {
      const mockHealthData = { status: 'OK', datacconnection: ["Connected"] };
      healthCheck.mockResolvedValue(mockHealthData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'healthcheck', '--format', 'json']);
  
      expect(healthCheck).toHaveBeenCalledWith('json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockHealthData, null, 2));
    });
  
    it('successfully performs a health check in CSV format', async () => {
      const mockHealthData = "status,database\nOK,Connected";
      healthCheck.mockResolvedValue(mockHealthData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'healthcheck', '--format', 'csv']);
  
      expect(healthCheck).toHaveBeenCalledWith('csv');
      expect(console.log).toHaveBeenCalledWith(mockHealthData);
    });
  
    it('handles error when health check fails', async () => {
      const errorMessage = 'Network Error';
      healthCheck.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'healthcheck']);
  
      expect(console.error).toHaveBeenCalledWith('Health Check failed:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });