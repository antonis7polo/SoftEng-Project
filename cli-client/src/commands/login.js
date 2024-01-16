const { login } = require('../apiClient');

const loginCommand = (program) => {
  program
    .command('login')
    .description('Authenticate with the API')
    .requiredOption('-u, --username <username>', 'Username')
    .requiredOption('-p, --passw <password>', 'Password')
    .action(async (cmd) => {
        const { username, passw } = cmd;
        try {
            const result = await login(username, passw);
            console.log('Welcome to NTUAFLIX!');
            console.log('Your ID is:', result.userID);
        } catch (error) {
            console.error('Login failed:', error.message);
            process.exit(1); // Set exit code to 1 on error

        }
    });
};

module.exports = loginCommand;
