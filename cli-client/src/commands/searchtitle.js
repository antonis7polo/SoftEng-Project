const { searchTitleByPart } = require('../apiClient');

const searchTitleCommand = (program) => {
  program
    .command('searchtitle')
    .description('Search for titles containing a part of a title')
    .requiredOption('-t, --titlepart <titlepart>', 'Part of the title to search for')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { titlepart, format } = cmd;
        const searchResults = await searchTitleByPart(titlepart, format);

        if (format === 'csv') {
          console.log(searchResults);
        } else {
          console.log(JSON.stringify(searchResults, null, 2));
        }
      } catch (error) {
        console.error('Error searching for title:', error.message);
        process.exit(1);
      }
    });
};

module.exports = searchTitleCommand;
