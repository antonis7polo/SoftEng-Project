jest.mock('../../src/apiClient', () => ({
    getTitleDetails: jest.fn(),
}));

const { getTitleDetails } = require('../../src/apiClient');
const { Command } = require('commander');
const titleDetailsCommand = require('../../src/commands/titledetails');


describe('titleDetailsCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      titleDetailsCommand(program);
    });
  
    it('successfully retrieves title details and displays in JSON format', async () => {
      const mockTitleID = 'tt0000929';
      const mockTitleDetails = {
        titleDetails: {
            titleID: "tt0000929",
            genres: [
                { genreTitle: "Comedy" },
                { genreTitle: "Short" }
            ],
            leadActors: [
                { nameID: "nm0066941" },
                { nameID: "nm0170183" }
            ],
            directors: [{nameid: "nm0000001"}]
        }
    };
      getTitleDetails.mockResolvedValue(mockTitleDetails);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'titledetails', '--titleid', mockTitleID, '--format', 'json']);
  
      expect(getTitleDetails).toHaveBeenCalledWith(mockTitleID, 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockTitleDetails, null, 2));
    });
  
    it('successfully retrieves title details and displays in CSV format', async () => {
      const mockTitleID = 'tt0000929';
      const mockTitleDetailsCSV = "titleID,genres,leadActors,directors\n" +
      "tt0000929,Comedy;Short,nm0066941;nm0170183,nm0000001";
      getTitleDetails.mockResolvedValue(mockTitleDetailsCSV);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'titledetails', '--titleid', mockTitleID, '--format', 'csv']);
  
      expect(getTitleDetails).toHaveBeenCalledWith(mockTitleID, 'csv');
      expect(console.log).toHaveBeenCalledWith(mockTitleDetailsCSV);
    });
  
    it('handles error when retrieving title details fails', async () => {
      const mockTitleID = 'tt0000000';
      const errorMessage = 'Title details not found';
      getTitleDetails.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'titledetails', '--titleid', mockTitleID]);
  
      expect(getTitleDetails).toHaveBeenCalledWith(mockTitleID, 'json'); // Default format is json
      expect(console.error).toHaveBeenCalledWith('Error retrieving title details:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });