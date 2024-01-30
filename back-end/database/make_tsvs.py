import csv
import random
import hashlib

# Function to generate a random hashed password
def generate_hashed_password():
    return hashlib.sha256(str(random.randint(1, 1000000)).encode()).hexdigest()

# Generate more users
# Sample lists of first names and last names
first_names = ["Alice", "Bob", "Charlie", "Diana", "Edward"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones"]

# Function to generate a random username
def generate_username(first_names, last_names):
    return random.choice(first_names) + random.choice(last_names)

def generate_email(username, domain="gmail.com"):
    return f"{username.lower()}@{domain}"

# Generate users
users_data = []
for i in range(1, 101):  # Generating 100 users
    username = generate_username(first_names, last_names)
    email = generate_email(username)
    users_data.append({ "username": username, "email": email, "password": generate_hashed_password(), "isAdmin": False})
# users_data now contains the user details

# Function to read Titles.tsv and get title IDs
def read_title_ids(file_path):
    title_ids = []
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        for row in reader:
            title_ids.append(row['title_id'])
    return title_ids

# Path to Titles.tsv file
titles_file_path = 'Titles.tsv'

# Read title IDs from Titles.tsv
title_ids = read_title_ids(titles_file_path)

# Generate user title ratings
user_title_ratings_data = []
for user_id in range(1, 101):  # For 100 users
    # Assign ratings to a random selection of titles
    for title_id in random.sample(title_ids, 10):  # Assuming each user rates 10 titles
        user_rating = random.randint(1, 10)
        user_title_ratings_data.append({"user_id": user_id, "title_id": title_id, "user_rating": user_rating})

# user_title_ratings_data now contains the ratings data





# Function to create a TSV file from data
def create_tsv_file(data, filename):
    with open(filename, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys(), delimiter='\t')
        writer.writeheader()
        writer.writerows(data)

# Create TSV files for each table
create_tsv_file(users_data, 'Users.tsv')
create_tsv_file(user_title_ratings_data, 'User_Title_Ratings.tsv')
print("TSV files created successfully.")
