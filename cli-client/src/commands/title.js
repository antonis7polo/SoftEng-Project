const { getTitleByID } = require('../apiClient');

const titleCommand = (program) => {
  program
    .command('title')
    .description('Get details of a title by ID')
    .requiredOption('-t, --titleID <titleID>', 'ID of the title')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { titleID, format } = cmd;
        const titleData = await getTitleByID(titleID, format);

        if (format === 'csv') {
          console.log(titleData);
        } else {
          console.log(JSON.stringify(titleData, null, 2));
        }
      } catch (error) {
        console.error('Error retrieving title:', error.message);
        process.exit(1);
      }
    });
};

module.exports = titleCommand;