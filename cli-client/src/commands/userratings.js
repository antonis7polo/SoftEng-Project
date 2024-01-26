const { getUserRatings } = require('../apiClient');

const userRatingsCommand = (program) => {
  program
    .command('userratings')
    .description('Get ratings by a user')
    .requiredOption('-u, --userid <userid>', 'User ID')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { userid, format } = cmd;
        const ratingsData = await getUserRatings(userid, format);

        if (format === 'csv') {
          console.log(ratingsData);
        } else {
          console.log(JSON.stringify(ratingsData, null, 2));
        }
      } catch (error) {
        console.error('Error retrieving user ratings:', error.message);
        process.exit(1);
      }
    });
};

module.exports = userRatingsCommand;
