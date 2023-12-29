import csv
import random
import hashlib

# Function to generate a random hashed password
def generate_hashed_password():
    return hashlib.sha256(str(random.randint(1, 1000000)).encode()).hexdigest()

# Generate more users
users_data = [
    {
        "user_id": i,
        "username": f"user{i}",
        "email": f"user{i}@example.com",
        "password": generate_hashed_password()
    }
    for i in range(1, 101)  # Generating 100 users
]

# Generate more user preferences
user_preferences_data = [
    {"user_id": i, "genre": random.choice(["Comedy", "Drama", "Action", "Sci-Fi"])}
    for i in range(1, 101)  # Generating 100 user preferences
]

# Generate more user title ratings
user_title_ratings_data = [
    {"user_id": i, "title_id": f"tt{i}", "user_rating": random.randint(1, 10)}
    for i in range(1, 101)  # Generating 100 user title ratings
]

# Generate more user watched data
user_watched_data = [
    {"user_id": i, "title_id": f"tt{i}", "watched_on": f"2023-01-{i} 20:30:00", "rating": random.randint(1, 10)}
    for i in range(1, 101)  # Generating 100 user watched data
]


# Function to create a TSV file from data
def create_tsv_file(data, filename):
    with open(filename, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys(), delimiter='\t')
        writer.writeheader()
        writer.writerows(data)

# Create TSV files for each table
create_tsv_file(users_data, 'Users.tsv')
create_tsv_file(user_preferences_data, 'User_Preferences.tsv')
create_tsv_file(user_title_ratings_data, 'User_Title_Ratings.tsv')
create_tsv_file(user_watched_data, 'User_Watched.tsv')

print("TSV files created successfully.")
