jest.mock('../../src/apiClient', () => ({
    getAllTvShowsEpisodes: jest.fn(),
}));

const { getAllTvShowsEpisodes } = require('../../src/apiClient');
const { Command } = require('commander');
const tvShowsEpisodesCommand = require('../../src/commands/tvshowsepisodes');

describe('tvShowsEpisodesCommand', () => {
    let program;

    beforeEach(() => {
        jest.clearAllMocks();
        program = new Command();
        tvShowsEpisodesCommand(program);
    });

    it('successfully retrieves TV shows episodes and displays in JSON format', async () => {
        const mockData = {
            shows: {
                "tt0000929": {
                    "1": [
                        {
                            episode_title_id: "tt0000929e01",
                            episode_title: "Episode 1",
                            parent_tv_show_title_id: "tt0000929",
                            season_number: "1",
                            episode_number: "1"
                        },
                        {
                            episode_title_id: "tt0000929e02",
                            episode_title: "Episode 2",
                            parent_tv_show_title_id: "tt0000929",
                            season_number: "1",
                            episode_number: "2"
                        }
                    ],
                    "2": [
                        {
                            episode_title_id: "tt0000929e03",
                            episode_title: "Episode 3",
                            parent_tv_show_title_id: "tt0000929",
                            season_number: "2",
                            episode_number: "1"
                        }
                    ]
                },
                "tt0000930": {
                    "1": [
                        {
                            episode_title_id: "tt0000930e01",
                            episode_title: "Episode 1",
                            parent_tv_show_title_id: "tt0000930",
                            season_number: "1",
                            episode_number: "1"
                        }
                    ]
                }
            }
        };

        getAllTvShowsEpisodes.mockResolvedValue(mockData);

        console.log = jest.fn(); // Mock console.log to capture output

        await program.parseAsync(['node', 'test', 'tvshowsepisodes', '--format', 'json']);

        expect(getAllTvShowsEpisodes).toHaveBeenCalledWith('json');
        expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2));
    });

    it('successfully retrieves TV shows episodes and displays in CSV format', async () => {
        const mockDataCSV = "episode_title_id,episode_title,parent_tv_show_title_id,season_number,episode_number\n" +
        "tt0000929e01,Episode 1,tt0000929,1,1\n" +
        "tt0000929e02,Episode 2,tt0000929,1,2\n" +
        "tt0000929e03,Episode 3,tt0000929,2,1\n" +
        "tt0000930e01,Episode 1,tt0000930,1,1";
        getAllTvShowsEpisodes.mockResolvedValue(mockDataCSV);

        console.log = jest.fn(); // Mock console.log to capture output

        await program.parseAsync(['node', 'test', 'tvshowsepisodes', '--format', 'csv']);

        expect(getAllTvShowsEpisodes).toHaveBeenCalledWith('csv');
        expect(console.log).toHaveBeenCalledWith(mockDataCSV);
    });

    it('handles error when retrieving TV shows episodes fails', async () => {
        const errorMessage = 'Failed to fetch data';
        getAllTvShowsEpisodes.mockRejectedValue(new Error(errorMessage));

        console.error = jest.fn(); // Mock console.error to capture error output
        process.exit = jest.fn(); // Mock process.exit to prevent actual exit

        await program.parseAsync(['node', 'test', 'tvshowsepisodes']);

        expect(getAllTvShowsEpisodes).toHaveBeenCalledWith('json'); // Default format is json
        expect(console.error).toHaveBeenCalledWith('Error retrieving TV shows episodes:', errorMessage);
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});