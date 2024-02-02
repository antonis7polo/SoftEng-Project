jest.mock('../../src/apiClient', () => ({
    getTitleByID: jest.fn(),
}));

const { getTitleByID } = require('../../src/apiClient');
const { Command } = require('commander');
const titleCommand = require('../../src/commands/title');

describe('titleCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      titleCommand(program);
    });
  
    it('successfully retrieves title details and displays in JSON format', async () => {
      const mockTitleID = 'tt0000929';
      const mockTitleData = {
        titleObject: {
            titleID: "tt0000929",
            type: "short",
            originalTitle: "Klebolin klebt alles",
            titlePoster: null,
            startYear: "1990",
            endYear: null,
            genres: [
                { genreTitle: "Comedy" },
                { genreTitle: "Short" }
            ],
            titleAkas: [
                { akaTitle: "Willys Streiche: Klebolin klebt alles", regionAbbrev: "DE" },
                { akaTitle: "Klebolin klebt alles", regionAbbrev: null },
                { akaTitle: "Klebolin klebt alles", regionAbbrev: "DE" }
            ],
            principals: [
                { nameID: "nm0066941", name: "Ernst Behmer", category: "actor" },
                { nameID: "nm0170183", name: "Victor Colani", category: "actor"}
            ],
            rating: {
                avRating: "5.30",
                nVotes: "46"
            }
        }
      };
      getTitleByID.mockResolvedValue(mockTitleData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'title', '--titleID', mockTitleID]);
  
      expect(getTitleByID).toHaveBeenCalledWith(mockTitleID, 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockTitleData, null, 2));
    });
  
    it('successfully retrieves title details and displays in CSV format', async () => {
      const mockTitleID = 'tt0000929';
      const mockTitleDataCSV = "titleID,type,originalTitle,titlePoster,startYear,endYear,genres,titleAkas,principals,rating\n" +
      "tt0000929,short,Klebolin klebt alles,,1990,,Comedy,Short,Willys Streiche: Klebolin klebt alles,DE,Klebolin klebt alles,,DE,Ernst Behmer,nm0066941,actor,Victor Colani,nm0170183,actor,5.30,46";
      getTitleByID.mockResolvedValue(mockTitleDataCSV);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'title', '--titleID', mockTitleID, '--format', 'csv']);
  
      expect(getTitleByID).toHaveBeenCalledWith(mockTitleID, 'csv');
      expect(console.log).toHaveBeenCalledWith(mockTitleDataCSV);
    });
  
    it('handles error when retrieving title details fails', async () => {
      const mockTitleID = 'tt0000000';
      const errorMessage = 'Title not found';
      getTitleByID.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'title', '--titleID', mockTitleID]);
  
      expect(getTitleByID).toHaveBeenCalledWith(mockTitleID, 'json'); // Default format is json
      expect(console.error).toHaveBeenCalledWith('Error retrieving title:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });