#!/bin/bash
TEMP_SCRIPT="/tmp/setup_softeng23-21_db.sql"

mysql -u root -p --local-infile < "$TEMP_SCRIPT"
echo 'Database setup complete. Exiting MySQL.'
rm "$TEMP_SCRIPT"
read -p 'Press enter to close this terminal...' key

