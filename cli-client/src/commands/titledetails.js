const { getTitleDetails } = require('../apiClient');

const titleDetailsCommand = (program) => {
  program
    .command('titledetails')
    .description('Get details of a title')
    .requiredOption('-i, --titleid <titleID>', 'Title ID')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { titleid, format } = cmd;
        const titleDetails = await getTitleDetails(titleid, format);

        if (format === 'csv') {
          console.log(titleDetails);
        } else {
          console.log(JSON.stringify(titleDetails, null, 2));
        }
      } catch (error) {
        console.error('Error retrieving title details:', error.message);
        process.exit(1);
      }
    });
};

module.exports = titleDetailsCommand;
