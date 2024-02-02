const nock = require('nock');
const { getToken } = require('../../src/utils/tokenStorage');
const { getAllTvShowsEpisodes } = require('../../src/apiClient');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('getAllTvShowsEpisodes', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves all episodes of a TV show in JSON format', async () => {
        const mockResponse = {
            shows: {
                "tt0000929": {
                    "1" : [
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
                    "2" : [
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
                "1" : [
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

        nock(baseURL)
            .get('/tv-shows/episodes')
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        
        const response = await getAllTvShowsEpisodes('json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves all episodes of a TV show in CSV format', async () => {
        const csvResponse = "episode_title_id,episode_title,parent_tv_show_title_id,season_number,episode_number\n" +
            "tt0000929e01,Episode 1,tt0000929,1,1\n" +
            "tt0000929e02,Episode 2,tt0000929,1,2\n" +
            "tt0000929e03,Episode 3,tt0000929,2,1\n" +
            "tt0000930e01,Episode 1,tt0000930,1,1";

        nock(baseURL)
            .get('/tv-shows/episodes')
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        const response = await getAllTvShowsEpisodes('csv');
        expect(response).toEqual(csvResponse);
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .get('/tv-shows/episodes')
            .query({ format: 'json' })
            .reply(401, { message: 'Unauthorized access' });

        await expect(getAllTvShowsEpisodes('json')).rejects.toThrow('Unauthorized access');
    });

    it('throws an error for internal server error', async () => {
        nock(baseURL)
            .get('/tv-shows/episodes')
            .query({ format: 'json' })
            .reply(500, { message: 'Internal server error' });

        await expect(getAllTvShowsEpisodes('json')).rejects.toThrow('Internal server error');
    });

    it('throws an error for no token found', async () => {
        getToken.mockReturnValue(null);

        await expect(getAllTvShowsEpisodes()).rejects.toThrow('No token found');
    });

});