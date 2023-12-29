
import os

def cleanup_tsv_files(folder):
    '''
    This function deletes all TSV files in the specified folder.
    It assumes that these TSV files are outputs of the data_normalizer script.
    '''
    print("Starting cleanup of TSV files...")

    # List all files in the folder
    for file in os.listdir(folder):
        # Check if the file is a TSV file
        if file.endswith(".tsv"):
            tsv_file_path = os.path.join(folder, file)
            
            # Delete the TSV file
            os.remove(tsv_file_path)
            print(f"Deleted TSV file: {tsv_file_path}")

    print("Cleanup complete.")

if __name__ == "__main__":
    # Replace 'your_folder_path' with the path of the folder containing the TSV files.
    #the folder path is the current directory
    folder_path = os.getcwd()
    cleanup_tsv_files(folder_path)
