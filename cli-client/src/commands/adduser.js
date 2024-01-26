const { addUser } = require('../apiClient');

const addUserCommand = (program) => {
  program
    .command('adduser')
    .description('Add or update a user')
    .requiredOption('-u, --username <username>', 'Username')
    .requiredOption('-p, --passw <password>', 'Password')
    .requiredOption('-e, --email <email>', 'Email')
    .requiredOption('-a, --isAdmin <isAdmin>', 'Is Admin? (1 or 0)')
    .action(async (cmd) => {
      try {
        const { username, passw, email, isAdmin } = cmd;

        await addUser(username, passw, email, isAdmin);
        console.log('User added/updated successfully.');
      } catch (error) {
        console.error('Failed to add/update user:', error.message);
        process.exit(1);

      }
    });
};

module.exports = addUserCommand;
