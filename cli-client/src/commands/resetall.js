// resetall.js
const { resetAll } = require('../apiClient');

const resetAllCommand = (program) => {
  program
    .command('resetall')
    .description('Reset all data in the database')
    .action(async () => {
      try {
        const result = await resetAll();
        console.log('Reset all operation successful:', result.status);
      } catch (error) {
        console.error('Reset all operation failed:', error.message);
        process.exit(1);
      }
    });
};

module.exports = resetAllCommand;
