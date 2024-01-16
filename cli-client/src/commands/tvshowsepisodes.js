const { getAllTvShowsEpisodes } = require('../apiClient');

const tvShowsEpisodesCommand = (program) => {
  program
    .command('tvshowsepisodes')
    .description('Retrieve all TV shows episodes')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { format } = cmd;
        const data = await getAllTvShowsEpisodes(format);

        if (format === 'csv') {
          console.log(data);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      } catch (error) {
        console.error('Error retrieving TV shows episodes:', error.message);
        process.exit(1);
      }
    });
};

module.exports = tvShowsEpisodesCommand;
