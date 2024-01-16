const fs = require('fs');
const { uploadTitlePrincipals } = require('../apiClient');

const newPrincipalsCommand = (program) => {
    program
        .command('newprincipals')
        .description('Upload new title principals')
        .requiredOption('-f, --filename <filename>', 'Path to the file to upload')
        .action(async (cmd) => {
        try {
            const { filename } = cmd;
            if (!fs.existsSync(filename)) {
                console.error('File not found:', filename);
                process.exit(1);
                return;
            }
            const result = await uploadTitlePrincipals(filename);
            console.log('File uploaded successfully:', result.message);
        } catch (error) {
            console.error('Failed to upload file:', error.message);
            process.exit(1);
        }
        });
};

module.exports = newPrincipalsCommand;

