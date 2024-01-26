const { getMovieRecommendations } = require('../apiClient');

const recommendationsCommand = (program) => {
  program
    .command('recommendations')
    .description('Get movie recommendations')
    .requiredOption('-g, --genres <genres>', 'Genres (comma-separated)')
    .requiredOption('-a, --actors <actors>', 'Actors (comma-separated IDs)')
    .requiredOption('-d, --director <director>', 'Director ID')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { genres, actors, director, format } = cmd;
        const genreArray = genres.split(',');
        const actorArray = actors.split(',');
        const recommendations = await getMovieRecommendations(genreArray, actorArray, director, format);

        if (format === 'csv') {
          console.log(recommendations);
        } else {
          console.log(JSON.stringify(recommendations, null, 2));
        }
      } catch (error) {
        console.error('Error getting recommendations:', error.message);
        process.exit(1);
      }
    });
};

module.exports = recommendationsCommand;
