jest.mock('../../src/apiClient', () => ({
    searchNameByPart: jest.fn(),
}));

const { searchNameByPart } = require('../../src/apiClient');
const { Command } = require('commander');
const searchNameCommand = require('../../src/commands/searchname');

describe('searchNameCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      searchNameCommand(program);
    });
  
    it('successfully searches names and displays results in JSON format', async () => {
      const mockResults = {
        nameObject: {
            nameID: "nm0000095",
            name: "Woody Allen",
            namePoster: "https://image.tmdb.org/t/p/{width_variable}/wcPQgZLDibuej1RwNTy1R2U2ZJw.jpg",
            birthYr: "1935",
            deathYr: null,
            profession: "actor, director, writer",
            nameTitles: [
                { titleID: "tt0099012", "category": "director" }
            ]
        }
      };
      searchNameByPart.mockResolvedValue(mockResults);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'searchname', '--name', 'Woody']);
  
      expect(searchNameByPart).toHaveBeenCalledWith('Woody', 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockResults, null, 2));
    });
  
    it('successfully searches names and displays results in CSV format', async () => {
      const mockResults = "nameID,name,namePoster,birthYr,deathYr,profession,nameTitles\n" +
        "nm0000095,Woody Allen,https://image.tmdb.org/t/p/{width_variable}/wcPQgZLDibuej1RwNTy1R2U2ZJw.jpg,1935,,actor, director, writer,tt0099012,director";
      searchNameByPart.mockResolvedValue(mockResults);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'searchname', '--name', 'John', '--format', 'csv']);
  
      expect(searchNameByPart).toHaveBeenCalledWith('John', 'csv');
      expect(console.log).toHaveBeenCalledWith(mockResults);
    });
  
    it('handles error when search fails', async () => {
      const errorMessage = 'Error searching database';
      searchNameByPart.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'searchname', '--name', 'Nonexistent']);
  
      expect(console.error).toHaveBeenCalledWith('Error searching for name:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });