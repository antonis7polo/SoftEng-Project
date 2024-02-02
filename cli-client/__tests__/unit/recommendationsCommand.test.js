jest.mock('../../src/apiClient', () => ({
    getMovieRecommendations: jest.fn(),
}));

const { getMovieRecommendations } = require('../../src/apiClient');
const { Command } = require('commander');
const recommendationsCommand = require('../../src/commands/getmovierecommendations');

describe('recommendationsCommand', () => {
    let program;
  
    beforeEach(() => {
      jest.clearAllMocks();
      program = new Command();
      recommendationsCommand(program);
    });
  
    it('successfully gets movie recommendations in JSON format', async () => {
      const mockResponse = 
        { movies: [
            {
                title_id: "tt0000001",
                original_title: "Test Movie",
                image_url_poster: "https://example.com/poster.jpg",
                average_rating: "8.2",
                num_votes: "1000"
            },
            {
                title_id: "tt0000002",
                original_title: "Test Movie 2",
                image_url_poster: "https://example.com/poster2.jpg",
                average_rating: "7.5",
                num_votes: "500"
            }

          ]
        };
      getMovieRecommendations.mockResolvedValue(mockResponse);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'recommendations', '--genres', 'Comedy,Drama', '--actors', 'nm000001,nm000002', '--director', 'nm000003', '--format', 'json']);
  
      expect(getMovieRecommendations).toHaveBeenCalledWith(['Comedy', 'Drama'], ['nm000001', 'nm000002'], 'nm000003', 'json');
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(mockResponse, null, 2));
    });
  
    it('successfully gets movie recommendations in CSV format', async () => {
      const mockResponse = 'title_id,original_title,image_url_poster,average_rating,num_votes\ntt0000001,Test Movie,https://example.com/poster.jpg,8.2,1000\ntt0000002,Test Movie 2,https://example.com/poster2.jpg,7.5,500';
      getMovieRecommendations.mockResolvedValue(mockResponse);
  
      console.log = jest.fn(); // Mock console.log to capture output
  
      await program.parseAsync(['node', 'test', 'recommendations', '--genres', 'Comedy,Drama', '--actors', 'nm000001,nm000002', '--director', 'nm000003', '--format', 'csv']);
  
      expect(getMovieRecommendations).toHaveBeenCalledWith(['Comedy', 'Drama'], ['nm000001', 'nm000002'], 'nm000003', 'csv');
      expect(console.log).toHaveBeenCalledWith(mockResponse);
    });
  
    it('handles error when getting recommendations fails', async () => {
      const errorMessage = 'API error';
      getMovieRecommendations.mockRejectedValue(new Error(errorMessage));
  
      console.error = jest.fn(); // Mock console.error to capture error output
      process.exit = jest.fn(); // Mock process.exit to prevent actual exit
  
      await program.parseAsync(['node', 'test', 'recommendations', '--genres', 'Comedy,Drama', '--actors', 'nm000001,nm000002', '--director', 'nm000003']);
  
      expect(console.error).toHaveBeenCalledWith('Error getting recommendations:', errorMessage);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });