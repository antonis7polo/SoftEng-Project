const fs = require('fs');
const { uploadNameBasics } = require('../apiClient');

const newNamesCommand = (program) => {
    program
        .command('newnames')
        .description('Upload new name basics')
        .requiredOption('-f, --filename <filename>', 'Path to the file to upload')
        .action(async (cmd) => {
        try {
            const { filename } = cmd;
            if (!fs.existsSync(filename)) {
                console.error('File not found:', filename);
                return;
            }
            const result = await uploadNameBasics(filename);
            console.log('File uploaded successfully:', result.message);
        } catch (error) {
            console.error('Failed to upload file:', error.message);
        }
        });
};

module.exports = newNamesCommand;