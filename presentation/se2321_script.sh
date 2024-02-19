#!/bin/bash

# This script demonstrates the usage of the se2321 CLI tool for various operations.

wait_for_enter() {
    read -p ""
}

# Authenticate with the API
echo "Authenticating with the API..."
wait_for_enter
se2321 login --username harrypap --passw el20022

echo

# Create a new user
echo "Creating a new user..."
wait_for_enter
se2321 adduser --username nickolasbv --passw nick123 --email nickolasbv@gmail.com --isAdmin 1

echo

# Get the details of a user
echo "Getting the details of a user..."
wait_for_enter
se2321 user --username nickolasbv

echo

# Get the details of a user CSV
echo "Getting the details of a user in CSV format..."
wait_for_enter
se2321 user --username nickolasbv --format csv

echo

# Perform a health check of the Database
echo "Performing a health check..."
wait_for_enter
se2321 healthcheck

echo

# Perform a health check of the Database in CSV format
echo "Performing a health check in CSV format..."
wait_for_enter
se2321 healthcheck --format csv

echo

# Get the details of a title by titleID
echo "Getting the details of a title..."
wait_for_enter
se2321 title --titleID tt0099851

echo

# Get the details of a title by titleID in CSV format
echo "Getting the details of a title in CSV format..."
wait_for_enter
se2321 title --titleID tt0099851 --format csv

echo

# Search for titles containing a part of a title
echo "Searching for titles..."
wait_for_enter
se2321 searchtitle --titlepart "wood"

echo

# Search for titles containing a part of a title in CSV format
echo "Searching for titles in CSV format..."
wait_for_enter
se2321 searchtitle --titlepart "wood" --format csv

echo

# Get titles by genre
echo "Getting titles by genre..."
wait_for_enter
se2321 bygenre --genre "Comedy" --min 8 --from 1990 --to 1991

echo

# Get titles by genre in CSV format
echo "Getting titles by genre in CSV format..."
wait_for_enter
se2321 bygenre --genre "Comedy" --min 8 --from 1990 --to 1991 --format csv

echo

# Get details of a person by nameID
echo "Getting details of a person..."
wait_for_enter
se2321 name --nameid nm0000095

echo

# Get details of a person by nameID in CSV format
echo "Getting details of a person in CSV format..."
wait_for_enter
se2321 name --nameid nm0000095 --format csv

echo

# Search for people by name
echo "Searching for people..."
wait_for_enter
se2321 searchname --name "wood"

echo

# Search for people by name in CSV format
echo "Searching for people in CSV format..."
wait_for_enter
se2321 searchname --name "wood" --format csv

echo

# Upload rating 
echo "Uploading a rating..."
wait_for_enter
se2321 uploadrating --userid 1 --titleid tt0099851 --rating 10

echo

# Get the ratings of a user
echo "Getting the ratings of a user..."
wait_for_enter
se2321 userratings --userid 1

echo

# Get the ratings of a user in CSV format
echo "Getting the ratings of a user in CSV format..."
wait_for_enter
se2321 userratings --userid 1 --format csv

echo

# Delete rating
echo "Deleting a rating..."
wait_for_enter
se2321 deleterating --userid 1 --titleid tt0099851

echo

# Get recommendations 
echo "Getting recommendations"
wait_for_enter
se2321 recommendations --genres Comedy,Adult --actors nm0594226,nm0183881 --director nm0750201,nm0608232

echo

# Get recommendations in CSV format
echo "Getting recommendations in CSV format"
wait_for_enter
se2321 recommendations --genres Comedy,Adult --actors nm0594226,nm0183881 --director nm0608232 --format csv

echo

# Get title details
echo "Getting title details"
wait_for_enter
se2321 titledetails --titleid tt0099851

echo

# Get title details in CSV format
echo "Getting title details in CSV format"
wait_for_enter
se2321 titledetails --titleid tt0099851 --format csv

echo

# Get homepage details
echo "Getting homepage details"
wait_for_enter
se2321 home

echo

# Get homepage details in CSV format
echo "Getting homepage details in CSV format"
wait_for_enter
se2321 home --format csv

echo

# Get tv episode details
echo "Getting tv episode details"
wait_for_enter
se2321 tvshowsepisodes

echo

# Get tv episode details in CSV format
echo "Getting tv episode details in CSV format"
wait_for_enter
se2321 tvshowsepisodes --format csv

echo

# Reset the database
echo "Resetting the database..."
wait_for_enter
se2321 resetall 

echo

# Upload title basics
echo "Uploading title basics..."
wait_for_enter
se2321 newtitles --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.basics.tsv

echo

# Upload title akas
echo "Uploading title akas..."
wait_for_enter
se2321 newakas --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.akas.tsv

echo

# Upload name basics
echo "Uploading name basics..."
wait_for_enter
se2321 newnames --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_name.basics.tsv

echo

# Upload title crew
echo "Uploading title crew..."
wait_for_enter
se2321 newcrew --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.crew.tsv

echo

# Upload title episode
echo "Uploading title episode..."
wait_for_enter
se2321 newepisode --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.episode.tsv

echo

# Upload title principal
echo "Uploading title principal..."
wait_for_enter
se2321 newprincipals --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.principals.tsv

echo

# Upload title ratings
echo "Uploading title ratings..."
wait_for_enter
se2321 newratings --filename /Users/harrypapadakis/Documents/7th_semester/software_engineering/truncated_data/truncated_title.ratings.tsv

echo

# Logout from the API
echo "Logging out..."
wait_for_enter
se2321 logout

echo

echo "Script execution completed."
