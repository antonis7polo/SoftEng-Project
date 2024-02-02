jest.mock('../../src/apiClient', () => ({
    getTitlesByGenre: jest.fn(),
}));

const { getTitlesByGenre } = require('../../src/apiClient');
const { Command } = require('commander');
const byGenreCommand = require('../../src/commands/bygenre');

describe('byGenreCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      byGenreCommand(program);
    });
  
    it('successfully retrieves titles by genre in JSON format', async () => {
      const mockResponse = {
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
      getTitlesByGenre.mockResolvedValue(mockResponse);
  
      console.log = jest.fn(); // Mock console.log to verify output
  
      await program.parseAsync(['node', 'test', 'bygenre', '--genre', 'Comedy', '--min', '8']);
  
      expect(getTitlesByGenre).toHaveBeenCalledWith('Comedy', '8', undefined, undefined, 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockResponse, null, 2));
    });
  
    it('successfully retrieves titles by genre in CSV format', async () => {
      const mockResponse = "titleID,type,originalTitle,titlePoster,startYear,endYear,genres,titleAkas,principals,rating\n" +
        "tt0000929,short,Klebolin klebt alles,,1990,,Comedy;Short,Willys Streiche: Klebolin klebt alles,DE;Klebolin klebt alles,,DE;Ernst Behmer,nm0066941,actor;Victor Colani,nm0170183,actor,5.30,46";

      getTitlesByGenre.mockResolvedValue(mockResponse);
  
      console.log = jest.fn(); // Mock console.log to verify output
  
      await program.parseAsync(['node', 'test', 'bygenre', '--genre', 'Comedy', '--min', '8', '-f', 'csv']);
  
      expect(getTitlesByGenre).toHaveBeenCalledWith('Comedy', '8', undefined, undefined, 'csv');
      expect(console.log).toHaveBeenCalledWith(mockResponse);
    });
  
    it('handles error when retrieving titles fails', async () => {
      const errorMessage = 'API error';
      getTitlesByGenre.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to verify error output
      process.exit = jest.fn(); // Mock process.exit to prevent the test process from exiting
  
      await program.parseAsync(['node', 'test', 'bygenre', '--genre', 'Comedy', '--min', '8']);
  
      expect(console.error).toHaveBeenCalledWith('Error retrieving titles:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
  