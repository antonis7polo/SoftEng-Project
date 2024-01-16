const { getTitlesByGenre } = require('../apiClient');

const byGenreCommand = (program) => {
  program
    .command('bygenre')
    .description('Get titles by genre')
    .requiredOption('-g, --genre <genre>', 'Genre')
    .requiredOption('-m, --min <minrating>', 'Minimum rating')
    .option('--from <yrFrom>', 'Start Year')
    .option('--to <yrTo>', 'End Year')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { genre, min, from, to, format } = cmd;

        const titleObjects = await getTitlesByGenre(genre, min, from, to, format);

        if (format === 'csv') {
          console.log(titleObjects);
        } else {
          console.log(JSON.stringify(titleObjects, null, 2));
        }
      } catch (error) {
        console.error('Error retrieving titles:', error.message);
        process.exit(1);
      }
    });
};

module.exports = byGenreCommand;
