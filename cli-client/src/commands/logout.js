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
      }
    });
};

module.exports = logoutCommand;
