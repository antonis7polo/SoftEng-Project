jest.mock('../../src/apiClient', () => ({
    getNameByID: jest.fn(),
}));

const { getNameByID } = require('../../src/apiClient');
const { Command } = require('commander');
const nameCommand = require('../../src/commands/name');

describe('nameCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      nameCommand(program);
    });
  
    it('successfully fetches person details in JSON format', async () => {
      const mockData = {
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
      getNameByID.mockResolvedValue(mockData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'name', '--nameid', 'nm0000001', '--format', 'json']);
  
      expect(getNameByID).toHaveBeenCalledWith('nm0000001', 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2));
    });
  
    it('successfully fetches person details in CSV format', async () => {
      const mockData = "titleID,type,originalTitle,titlePoster,startYear,endYear,genres,titleAkas,principals,rating\n" +
      "tt0000929,short,Klebolin klebt alles,,1990,,Comedy,Short,Willys Streiche: Klebolin klebt alles,DE;Klebolin klebt alles,;Klebolin klebt alles,DE,nm0066941,Ernst Behmer,actor;nm0170183,Victor Colani,actor,5.30,46";
  
      getNameByID.mockResolvedValue(mockData);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'name', '--nameid', 'nm0000001', '--format', 'csv']);
  
      expect(getNameByID).toHaveBeenCalledWith('nm0000001', 'csv');
      expect(console.log).toHaveBeenCalledWith(mockData);
    });
  
    it('handles error when fetching details fails', async () => {
      const errorMessage = 'Not found';
      getNameByID.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'name', '--nameid', 'invalidID']);
  
      expect(console.error).toHaveBeenCalledWith('Error:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });