const { uploadUserRating } = require('../apiClient');

const uploadRatingCommand = (program) => {
  program
    .command('uploadrating')
    .description('Upload a rating for a title')
    .requiredOption('-u, --userid <userid>', 'User ID')
    .requiredOption('-t, --titleid <titleid>', 'Title ID')
    .requiredOption('-r, --rating <rating>', 'Rating (1-10)', parseFloat)
    .action(async (cmd) => {
      try {
        const { userid, titleid, rating } = cmd;
        if (isNaN(rating) || rating < 1 || rating > 10) {
          console.error('Invalid rating. Please enter a number between 1 and 10.');
          process.exit(1);
        }
        const result = await uploadUserRating(userid, titleid, String(rating));
        console.log(result.message);
      } catch (error) {
        console.error('Failed to upload rating:', error.message);
        process.exit(1);
      }
    });
};

module.exports = uploadRatingCommand;
