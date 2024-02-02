jest.mock('../../src/apiClient', () => ({
    searchTitleByPart: jest.fn(),
}));

const { searchTitleByPart } = require('../../src/apiClient');
const { Command } = require('commander');
const searchTitleCommand = require('../../src/commands/searchtitle');

describe('searchTitleCommand', () => {
  let program;

  beforeEach(() => {
    jest.clearAllMocks();
    program = new Command();
    searchTitleCommand(program);
  });

  it('successfully searches titles and displays results in JSON format', async () => {
    const mockResults = {
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
    searchTitleByPart.mockResolvedValue(mockResults);

    console.log = jest.fn(); // Mock console.log to capture output

    await program.parseAsync(['node', 'test', 'searchtitle', '--titlepart', 'Example']);

    expect(searchTitleByPart).toHaveBeenCalledWith('Example', 'json');
    expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockResults, null, 2));
  });

  it('successfully searches titles and displays results in CSV format', async () => {
    const mockResults = "titleID,type,originalTitle,titlePoster,startYear,endYear,genres,titleAkas,principals,rating\n" +
      "tt0000929,short,Klebolin klebt alles,,1990,,Comedy,Short,Willys Streiche: Klebolin klebt alles,DE,Klebolin klebt alles,,DE,Ernst Behmer,nm0066941,actor,Victor Colani,nm0170183,actor,5.30,46";
    searchTitleByPart.mockResolvedValue(mockResults);

    console.log = jest.fn(); // Mock console.log to capture output

    await program.parseAsync(['node', 'test', 'searchtitle', '--titlepart', 'Example', '--format', 'csv']);

    expect(searchTitleByPart).toHaveBeenCalledWith('Example', 'csv');
    expect(console.log).toHaveBeenCalledWith(mockResults);
  });

  it('handles error when search fails', async () => {
    const errorMessage = 'Error searching database';
    searchTitleByPart.mockRejectedValue(new Error(errorMessage));

    console.error = jest.fn(); // Mock console.error to capture error output
    process.exit = jest.fn(); // Mock process.exit to prevent actual exit

    await program.parseAsync(['node', 'test', 'searchtitle', '--titlepart', 'Nonexistent']);

    expect(console.error).toHaveBeenCalledWith('Error searching for title:', errorMessage);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});