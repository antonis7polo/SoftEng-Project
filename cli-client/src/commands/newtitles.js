// newtitles.js
const fs = require('fs');
const { uploadTitleBasics } = require('../apiClient');

const newTitlesCommand = (program) => {
  program
    .command('newtitles')
    .description('Upload new title basics')
    .requiredOption('-f, --filename <filename>', 'Path to the file to upload')
    .action(async (cmd) => {
      try {
        const { filename } = cmd;
        if (!fs.existsSync(filename)) {
            console.error('File not found:', filename);
            process.exit(1);
            return;
        }
        const result = await uploadTitleBasics(filename);
        console.log('File uploaded successfully:', result.message);
      } catch (error) {
        console.error('Failed to upload file:', error.message);
        process.exit(1);
      }
    });
};

module.exports = newTitlesCommand;
