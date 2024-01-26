const { getHomepageData } = require('../apiClient');

const homeCommand = (program) => {
  program
    .command('home')
    .description('Retrieve homepage data')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { format } = cmd;
        const data = await getHomepageData(format);
        
        if (format === 'csv') {
          console.log(data);
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
      } catch (error) {
        console.error('Error retrieving homepage data:', error.message);
        process.exit(1);
      }
    });
};

module.exports = homeCommand;
