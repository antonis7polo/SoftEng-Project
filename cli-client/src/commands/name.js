const { getNameByID} = require('../apiClient');

const nameCommand = (program) => {
    program
        .command('name')
        .description('Get details of a person by their ID')
        .requiredOption('-n, --nameid <name>', 'Name ID')
        .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
        .action(async (cmd) => {
        try {
            const { nameid, format } = cmd;
            const personData = await getNameByID(nameid, format);
    
            if (format === 'csv') {
            console.log(personData);
    
            } else {
            console.log(JSON.stringify(personData, null, 2)); // Pretty print JSON
            }
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
        });
};

module.exports = nameCommand;
