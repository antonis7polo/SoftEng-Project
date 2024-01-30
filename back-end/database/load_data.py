import os
import csv

def tsv_to_sql_insert(tsv_file_path, table_name, columns, output_file, batch_size=20000):
    with open(tsv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file, delimiter='\t')
        next(reader)  # Skip the header row
        batch = []
        for row in reader:
            values = [f"'{value.replace('\'', '\'\'')}'" if value != '\\N' else 'NULL' for value in row]
            batch.append(f"({', '.join(values)})")

            if len(batch) >= batch_size:
                sql_line = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES {', '.join(batch)};\n"
                output_file.write(sql_line)
                batch = []  # Reset batch

        # Write any remaining rows in the batch
        if batch:
            sql_line = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES {', '.join(batch)};\n"
            output_file.write(sql_line)



def main():
    # Mapping of TSV files to table names and their columns
    tsv_files = {
        'Names_.tsv': ('Names_', ['name_id', 'name_', 'birth_year', 'death_year', 'image_url']),
        'Titles.tsv': ('Titles', ['title_id', 'title_type', 'primary_title', 'original_title', 'is_adult', 'start_year', 'end_year', 'runtime_minutes', 'image_url_poster', 'average_rating', 'num_votes']),
        'Aliases.tsv': ('Aliases', ['title_id', 'ordering', 'title', 'region', 'language','type', 'attribute', 'is_original_title']),
        'Episode_belongs_to.tsv': ('Episode_belongs_to', ['episode_title_id', 'parent_tv_show_title_id', 'season_number', 'episode_number']),
        'Title_genres.tsv': ('Title_genres', ['title_id', 'genre']),
        'Name_worked_as.tsv': ('Name_worked_as', ['name_id', 'profession']),
        'Had_role.tsv': ('Had_role', ['title_id', 'name_id', 'role_']),
        'Known_for.tsv': ('Known_for', ['name_id', 'title_id']),
        'Directors.tsv': ('Directors', ['title_id', 'name_id']),
        'Writers.tsv': ('Writers', ['title_id', 'name_id']),
        'Principals.tsv': ('Principals', ['title_id', 'ordering', 'name_id', 'job_category', 'job', 'image_url']),
        # Add mappings for any other TSV files as needed
    }

    with open('ntuaflix_db_data.sql', 'w', encoding='utf-8') as output_file:
        # Add commands to disable constraints
        output_file.write("SET FOREIGN_KEY_CHECKS=0;\n\n")  # Disable foreign key checks
        # Process each TSV file
        for tsv_file, (table_name, columns) in tsv_files.items():
            tsv_to_sql_insert(tsv_file, table_name, columns, output_file)
            print(f"Processed {tsv_file} into {table_name} table.")

        # Add commands to re-enable constraints
        output_file.write("\nSET FOREIGN_KEY_CHECKS=1;")

if __name__ == "__main__":
    main()
