const { searchNameByPart } = require('../apiClient');

const searchNameCommand = (program) => {
    program
        .command('searchname')
        .description('Search for names containing a part of a name')
        .requiredOption('-n, --name <namepart>', 'Part of the name to search for')
        .option('-f, --format <format>', 'Specify the format of the output (json or csv)', 'json')
        .action(async (cmd) => {
        try {
            const { name, format } = cmd;
            const searchResults = await searchNameByPart(name, format);
    
            if (format === 'csv') {
            console.log(searchResults);
            } else {
            console.log(JSON.stringify(searchResults, null, 2));
            }
        } catch (error) {
            console.error('Error searching for name:', error.message);
            process.exit(1);
        }
        });
};

module.exports = searchNameCommand;