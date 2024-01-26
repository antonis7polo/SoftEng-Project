const { deleteUserRating } = require('../apiClient');

const deleteRatingCommand = (program) => {
  program
    .command('deleterating')
    .description('Delete a user rating for a title')
    .requiredOption('-u, --userid <userid>', 'User ID')
    .requiredOption('-t, --titleid <titleid>', 'Title ID')
    .action(async (cmd) => {
      try {
        const { userid, titleid } = cmd;
        const result = await deleteUserRating(userid, titleid);
        console.log(result.message);
      } catch (error) {
        console.error('Failed to delete rating:', error.message);
        process.exit(1);
      }
    });
};

module.exports = deleteRatingCommand;
