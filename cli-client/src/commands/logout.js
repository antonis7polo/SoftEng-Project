const { logout } = require('../apiClient');

const logoutCommand = (program) => {
  program
    .command('logout')
    .description('Logout from the API')
    .action(async () => {
      try {
        await logout();
        console.log('Logout successful!');
      } catch (error) {
        console.error('Logout failed:', error.message);
        process.exit(1); // Set exit code to 1 on error
      }
    });
};

module.exports = logoutCommand;
