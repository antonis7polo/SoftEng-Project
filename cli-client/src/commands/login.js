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
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    });
};

module.exports = loginCommand;
