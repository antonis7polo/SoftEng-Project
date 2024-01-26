// healthcheck.js
const { healthCheck } = require('../apiClient');

const healthCheckCommand = (program) => {
  program
    .command('healthcheck')
    .description('Perform a health check of the API')
    .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
    .action(async (cmd) => {
      try {
        const { format } = cmd;
        const healthData = await healthCheck(format);
        if (format === 'csv') {
          console.log(healthData);
        } else {
          console.log(JSON.stringify(healthData, null, 2));
        }
      } catch (error) {
        console.error('Health Check failed:', error.message);
        process.exit(1);
      }
    });
};

module.exports = healthCheckCommand;
