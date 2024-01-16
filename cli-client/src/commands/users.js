// users.js
const { getUser } = require('../apiClient');

const userCommand = (program) => {
  program
    .command('user')
    .description('Get details of a user')
    .requiredOption('-u, --username <username>', 'Username of the user')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { username, format } = cmd;
        const userData = await getUser(username, format);

        if (format === 'csv') {
          console.log(userData);

        } else {
          console.log(JSON.stringify(userData, null, 2)); // Pretty print JSON
        }
      } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
      }
    });
};

module.exports = userCommand;
