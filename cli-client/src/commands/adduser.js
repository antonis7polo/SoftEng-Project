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
        const isAdminInt = parseInt(isAdmin, 10);
        if (isAdminInt !== 0 && isAdminInt !== 1) {
            throw new Error('isAdmin must be either 1 or 0');
        }
        await addUser(username, passw, email, isAdminInt);
        console.log('User added/updated successfully.');
      } catch (error) {
        console.error('Failed to add/update user:', error.message);
      }
    });
};

module.exports = addUserCommand;
