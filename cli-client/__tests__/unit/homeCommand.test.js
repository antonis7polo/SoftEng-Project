jest.mock('../../src/apiClient', () => ({
    getHomepageData: jest.fn(),
}));

const { getHomepageData } = require('../../src/apiClient');
const { Command } = require('commander');
const homeCommand = require('../../src/commands/home');

describe('homeCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      homeCommand(program);
    });
  
    it('successfully retrieves homepage data in JSON format', async () => {
        const mockData = {
            data: {
                topRatedMovies: [
                    {titleID: "tt0000929"}, {titleID: "tt0000930"}, {titleID: "tt0000931"}
                ],
                newReleases: [
                    {titleID: "tt0000932"}, {titleID: "tt0000933"}, {titleID: "tt0000934"}
                ],
                popularInAction: [
                    {titleID: "tt0000935"}, {titleID: "tt0000936"}, {titleID: "tt0000937"}
                ]
            }
        };
      getHomepageData.mockResolvedValue(mockData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'home', '--format', 'json']);
  
      expect(getHomepageData).toHaveBeenCalledWith('json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2));
    });
  
    it('successfully retrieves homepage data in CSV format', async () => {
      const mockData = "topRatedMovies,newReleases,popularInAction\n" +
        "tt0000929;tt0000930;tt0000931,tt0000932;tt0000933;tt0000934,tt0000935;tt0000936;tt0000937";
      getHomepageData.mockResolvedValue(mockData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'home', '--format', 'csv']);
  
      expect(getHomepageData).toHaveBeenCalledWith('csv');
      expect(console.log).toHaveBeenCalledWith(mockData);
    });
  
    it('handles error when retrieving homepage data fails', async () => {
      const errorMessage = 'API error';
      getHomepageData.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'home']);
  
      expect(console.error).toHaveBeenCalledWith('Error retrieving homepage data:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });