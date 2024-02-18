#!/bin/bash

# Cloning the repository
echo "Cloning the Ntuaflix repository..."
git clone https://github.com/ntua/softeng23-21
echo "Repository cloned. Press enter to continue"
read

echo "Navigating to the project directory..."
cd softeng23-21
echo "Press enter to continue"
read

# Installing Node.js packages
echo "Installing Node.js packages..."
npm install
echo "Node.js packages installed. Press enter to continue"
read

# Database Setup in a new terminal
echo "Setting up the database in a new terminal..."
# Create a temporary SQL script file
TEMP_SCRIPT="/tmp/setup_softeng23-21_db.sql"
echo "Creating temporary SQL script file..."
cat > $TEMP_SCRIPT <<EOF
SOURCE /Users/harrypapadakis/presentation/softeng23-21/back-end/database/ntuaflix_db.sql;
SOURCE /Users/harrypapadakis/presentation/softeng23-21/back-end/database/ntuaflix_db_constraints.sql;
SOURCE /Users/harrypapadakis/presentation/softeng23-21/back-end/database/ntuaflix_db_index.sql;
SOURCE /Users/harrypapadakis/presentation/softeng23-21/back-end/database/ntuaflix_db_data.sql;
EOF

# Execute the SQL script in a new Terminal window
osascript <<EOF
tell application "Terminal"
    do script "/Users/harrypapadakis/presentation/execute_sql.sh"
end tell
EOF
echo "Please switch back to the initial terminal after the database setup is complete."
read -p "Press enter to continue once you're back from the database setup terminal..."

# Setting up environment variables for the API
echo "Setting up environment variables for the API..."
cd back-end/RESTful-API
echo "Creating .env file..."
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB=IMDb
KEY_PATH=/Users/harrypapadakis/foo/key.pem
CERT_PATH=/Users/harrypapadakis/foo/cert.pem
KEY_PASSPHRASE=ntuaflix
JWT_SECRET=V3ryS3cr3tK3y!2023
EOF
echo ".env file created for API. Press enter to continue"
read

# API Setup
echo "Installing API Node.js packages..."
npm install
echo "API Node.js packages installed. Press enter to continue"
read

# Frontend SSL setup
echo "Setting up SSL for the frontend..."
cd ../../front-end/ntuaflix
npm install
echo "Creating .env file for frontend..."
cat > .env << EOF
KEY_PATH=/Users/harrypapadakis/foo/key.pem
CERT_PATH=/Users/harrypapadakis/foo/cert.pem
KEY_PASSPHRASE=ntuaflix
EOF
echo ".env file created for frontend. Press enter to continue"
read

# Navigate to the RESTful-API directory for user creation and starting the backend
cd /Users/harrypapadakis/presentation/softeng23-21/back-end/RESTful-API

# Initial User Creation with a manual stop mechanism
echo "Creating the initial user. This will automatically stop after a duration."
# Start the user creation script in the background
node createUsers.js harrypap harrypapadakis02@gmail.com el20022 &
PID=$!
# Allow the script to run for a set duration (e.g., 10 seconds)
sleep 3
# Kill the createUsers.js process
kill $PID 2>/dev/null
echo "The user creation script has been stopped. Press enter to continue."
read

# Check if port 9876 is in use and kill the process
PORT=9876
PID=$(lsof -ti tcp:${PORT})
if [[ ! -z $PID ]]; then
  echo "Port ${PORT} is in use by PID ${PID}. Attempting to free it..."
  kill -9 ${PID}
  sleep 1 # Give it a moment to fully release the port
fi

# Proceed with starting the backend server
echo "Starting the backend server..."
node server.js &
BACKEND_PID=$!
echo "Backend server started with PID $BACKEND_PID."

# Starting the Frontend Application in a new terminal
echo "Starting the frontend application in a new terminal..."
FRONTEND_PATH="/Users/harrypapadakis/presentation/softeng23-21/front-end/ntuaflix"
osascript <<EOF
tell application "Terminal"
    do script "cd '${FRONTEND_PATH}'; node server.js"
end tell
EOF
echo "Frontend application is starting in a new terminal."

echo "Setup and application start complete. Follow any additional instructions in the README file of the repository."

# End of script
```
