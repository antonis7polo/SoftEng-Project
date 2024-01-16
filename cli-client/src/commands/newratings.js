const fs = require('fs');
const { uploadTitleRatings } = require('../apiClient');

const newRatingsCommand = (program) => {
    program
        .command('newratings')
        .description('Upload new title ratings')
        .requiredOption('-f, --filename <filename>', 'Path to the file to upload')
        .action(async (cmd) => {
        try {
            const { filename } = cmd;
            if (!fs.existsSync(filename)) {
                console.error('File not found:', filename);
                process.exit(1);
                return;
            }
            const result = await uploadTitleRatings(filename);
            console.log('File uploaded successfully:', result.message);
        } catch (error) {
            console.error('Failed to upload file:', error.message);
            process.exit(1);
        }
        });
};

module.exports = newRatingsCommand;