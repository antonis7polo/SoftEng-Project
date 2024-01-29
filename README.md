# Ntuaflix

### Project Overview

Ntuaflix is a comprehensive platform designed to aggregate and present detailed metadata about films and television series. This project was developed as part of the Software Engineering course at ECE NTUA, aimed at showcasing our ability to design and implement a full-stack application.

### Contributors

This project is the result of collaborative efforts by a team of aspiring software engineers:

- **Antonios Alexiadis** - Dedicated to frontend development and user interface design, with additional involvement in documentation.
- **Chrisostomos Kopitas** - Specialized in the development of the database and management of data.
- **Charidimos Papadakis** - Concentrated on API development and also contributed to the CLI client.
- **Nikolaos Bothos Vouterakos** - Oversaw project management and led testing initiatives, while also contributing to frontend development.

## Description
Ntuaflix is an innovative platform meticulously crafted for cinephiles and industry professionals, functioning as a comprehensive repository of metadata for films and television series. This dynamic platform primarily focuses on providing in-depth information, such as detailed synopses, extensive cast and crew lists, genre classifications and ratings. It stands out by offering personalized recommendations, tailored to enhance the users' exploration and discovery of cinematic content.

While Ntuaflix does not directly host film content, it excels in providing an enriched cinematic experience through its vast array of metadata and bespoke suggestions. The platform aims to elevate the user's engagement with cinema by offering detailed insights and information, making it an indispensable tool for both movie enthusiasts and professionals in the film industry. Whether it's uncovering hidden cinematic gems or keeping up-to-date with popular trends, Ntuaflix is the quintessential guide to the ever-evolving world of cinema.


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Back-End](#back-end)
  - [Front-End](#front-end)
  - [CLI Client](#cli-client)
  - [Testing](#testing)
- [Diagrams](#diagrams)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites
---
Before you begin, ensure you have met the following requirements:

- **Operating System**: A compatible operating system such as Windows, macOS, or Linux.
- **Node.js**: [Node.js](https://nodejs.org/) (v20.9.0 or higher) installed for running the backend and CLI client. 
- **Database**: Access to a MySQL database. Ensure MySQL (version 8.0.33 or higher) is installed and running.
- **Frontend**: For the frontend, you will need [Next.js](https://nextjs.org/) (version 14.0.4 or higher).
- **Browser**: A modern web browser like Google Chrome, Mozilla Firefox, or Safari.
- **CLI Tools**: Basic command-line interface tools installed on your system.
- **Git**: [Git](https://git-scm.com/) for version control.
- **API Testing Tool**: (Optional) An API testing tool like Postman for testing the API endpoints.

- To include all the libraries and dependencies in your README file, you can organize them based on the specific parts of your project: backend, frontend, CLI, etc. Here's an example of how you might format it:


### Setting Up the Environment
---

To set up the local development environment for your project, you'll need to guide users through several steps, including cloning the repository, installing dependencies, setting up the database, and running the servers for the backend, frontend, and CLI client. Here's an example of how you can structure these instructions in your README file:



## Usage

### Prerequisites
---

Before setting up the project, ensure you have the following installed:
- Node.js (version as per `package.json`)
- MySQL Server
- Git



### Cloning the Repository
---

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/ntua/softeng23-21
   ```

2. Navigate to the project directory:

   ```sh
   cd softeng23-21
   ```
3.Install the necessary Node.js packages:

   ```sh
   npm install
   ```

## Back-End

### Database Setup
---

To set up the Ntuaflix database locally using MySQL, follow these steps:

1. Open MySQL in your terminal:

    ```bash
    mysql -u root -p --local-infile
    ```

    Enter your MySQL root password when prompted.

2. Create the Ntuaflix database in MySQL:

    Within the MySQL shell, run the following command, replacing `path_to_ntuaflix_db.sql_file` with the actual path to the SQL file provided with the project:

    ```sql
    SOURCE path_to_ntuaflix_db.sql_file;
    ```

3. Add constraints to the Ntuaflix database:

    Still within the MySQL shell, execute the following command, replacing `path_to_ntuaflix_db_constraints.sql` with the path to the constraints SQL file:

    ```sql
    SOURCE path_to_ntuaflix_db_constraints.sql;
    ```

4. Add indexes to the Ntuaflix database:

    Lastly, run the following command, replacing `path_to_ntuaflix_db_index.sql` with the path to the index SQL file:

    ```sql
    SOURCE path_to_ntuaflix_db_index.sql;
    ```

After completing these steps, your local Ntuaflix database should be set up and ready for use with the rest of the application.


### API Setup
---

1. Navigate to the API directory:

   ```sh
   cd back-end/RESTful-API
   ```

2. Install the necessary Node.js packages:

   ```sh
   npm install
   ```

#### Setting Up Environment Variables
---
To run the API, you need to set environment variables. Create a `.env` file in the root of the RESTful-API directory and configure the following variables:

1. **Database Configuration:**
    - `DB_HOST`: The hostname of your database server (e.g., `localhost`).
    - `DB_PORT`: The port number on which your database is running (e.g., `3306` for MySQL).
    - `DB_USER`: Your database username (e.g., `root`).
    - `DB_PASS`: Your database password.
    - `DB`: The name of the database you are using (e.g., `IMDb`).

2. **SSL Certificate Paths:**
    - `KEY_PATH`: The file path to your SSL key (e.g., `/Users/harrypapadakis/key.pem`).
    - `CERT_PATH`: The file path to your SSL certificate (e.g., `/Users/harrypapadakis/cert.pem`).

3. **JWT Secret:**
    - `JWT_SECRET`: A secret key for JSON Web Token (JWT) generation. It can be any string, preferably a complex and unique one (e.g., `V3ryS3cr3tK3y!2023`).

Here is a sample `.env` file for reference:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB=IMDb
KEY_PATH=/path/to/your/key.pem
CERT_PATH=/path/to/your/cert.pem
JWT_SECRET=YourSecretKey

Replace the values with your specific configurations. Ensure that the paths to the SSL key and certificate are correct and that the JWT secret is kept confidential.

#### Setting Up Self-Signed SSL Certificates
---
For the API to function securely, you need to set up SSL certificates. If you don't have existing SSL certificates, you can create self-signed certificates for development purposes. Follow these steps:

1. **Creating Self-Signed Certificates:**
    - Open your terminal or command prompt.
    - Run the following commands to generate a self-signed SSL certificate and key:

      ```shell
      openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
      ```

    - This command will prompt you for information and a password. Remember the password as you will need it to access the certificate.

2. **Configuring the API to Use the Certificates:**
    - Place the generated `key.pem` and `cert.pem` files in a secure directory on your machine.
    - Update your `.env` file to include the paths to these files. For example:

      ```plaintext
      KEY_PATH=/path/to/your/key.pem
      CERT_PATH=/path/to/your/cert.pem
      ```

    - Make sure the paths are correct and point to where you've stored your key and certificate files.

3. **Important Notes:**
    - Self-signed certificates are suitable for development and testing but are not recommended for production environments. For production, consider obtaining certificates from a trusted Certificate Authority (CA).
    - Keep your private key (`key.pem`) secure and do not share it publicly.

After setting up the SSL certificates, ensure that the other necessary environment variables are also configured in your `.env` file as described in the previous section.



## Front-End 
1. Navigate to the frontend directory from the root of the project:

   ```sh
   cd ../front-end/ntuaflix
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

### Frontend SSL Certificate Configuration
---

If your backend API is configured to use SSL, you will need to set up the frontend to work with these SSL configurations. This ensures secure communication between your frontend and the backend API. Follow these steps to set up SSL certificates for the frontend:

1. **Locate the SSL Certificate Files:**
   - Ensure you have the `key.pem` and `cert.pem` files that you generated for the backend. If you haven't created these yet, refer to the backend setup instructions.

2. **Configure `.env` File:**
   - In the root directory of the frontend project, create a `.env` file if it doesn't already exist.
   - Add the paths to your SSL certificate and key in the `.env` file, similar to how you did for the backend. For example:

     ```plaintext
     REACT_APP_KEY_PATH=/path/to/your/key.pem
     REACT_APP_CERT_PATH=/path/to/your/cert.pem
     ```

   - Make sure the paths correctly point to the SSL certificate and key files on your machine.

3. **Security Note:**
   - As with the backend, self-signed certificates are suitable for development and testing but not recommended for production. In a production environment, use certificates from a trusted CA.
   - Keep your private key secure and do not expose it in your public code repositories.

By configuring the frontend to recognize and use the SSL certificates, you ensure secure communication with the backend API, especially important when handling sensitive data or authentication information.


## CLI Client 
The project includes a Command Line Interface (CLI) client, which allows interaction with the backend API via command line. The CLI is accessed through the command `se2321`.

1. Navigate to the CLI directory:

   ```sh
   cd ../cli
   ```

2. Install the CLI dependencies:

   ```sh
   npm install
   ```

### Setup
---

Before using the CLI, ensure that it is properly installed and linked to the `se2321` command. 

1. **Create Symbolic Link**: You need to create a symbolic link named `se2321` that points to the `cli.js` file. This link allows you to use `se2321` as a command from anywhere in your terminal.

   Open your terminal and run the following command (replace `path/to/cli.js` with the actual path to your `cli.js` file):
   
```
ln -s /absolute/path/to/cli.js /usr/local/bin/se2321
```

2. **Make `cli.js` Executable**: Ensure that `cli.js` is executable. Run the following command:

```
chmod +x /absolute/path/to/cli.js
```


### Accessing the CLI
---
After installation, you can access the CLI from your terminal by using the `se2321` command followed by the specific action you want to perform. For instance, to log in, you would use:

```
se2321 login -u username -p password
```

### CLI Commands
---
The CLI includes several commands that allow you to interact with the backend system. These commands are defined in `cli.js` and are structured as follows:

- `login` - Authenticate with the API.
- `logout` - Logout from the API.
- `adduser` - Add or update a user.
- `user` - Get details of a user.
- `healthcheck` - Perform a health check of the API.
- `resetall` - Reset all data in the database.
- `newtitles` - Upload new title basics.
- `newakas` - Upload new title akas.
- `newnames` - Upload new name basics.
- `newcrew` - Upload new title crew.
- `newepisode` - Upload new title episode.
- `newprincipals` - Upload new title principals.
- `newratings` - Upload new title ratings.
- `title` - Get details of a title by ID.
- `searchtitle` - Search for titles containing a part of a title.
- `bygenre` - Get titles by genre.
- `name` - Get details of a person by their ID.
- `searchname` - Search for names containing a part of a name.
- `uploadrating` - Upload a rating for a title.
- `userratings` - Get ratings by a user.
- `deleterating` - Delete a user rating for a title.
- `recommendations` - Get movie recommendations.
- `titledetails` - Get detailed information of a title.
- `home` - Retrieve homepage data.
- `tvshowsepisodes` - Retrieve all TV shows episodes.
- `help` - Display help for command.

Each command comes with its own set of options and arguments. For detailed usage of each command, you can use the help option:

```
se2321 [command] --help
```

This will display the usage information for the specified command.

### Example Usage
---
To use the `adduser` command for adding a new user, the syntax would be:

```
se2321 adduser -u newusername -p newpassword -e user@example.com -a 0
```

### Note
---
The CLI is designed for interaction with the backend API, so ensure that your API server is running and accessible for the CLI to function correctly.

### Running the Application
1. Start the backend server:

   ```sh
   cd backend
   npm start
   ```

   This will start the backend server, typically running on `https://localhost:9876`.

2. In a new terminal, start the frontend application:

   ```sh
   cd frontend
   npm run dev
   ```

   The frontend should now be accessible at `http://localhost:3000`.

3. Use the CLI client by running its commands from the CLI directory.

   ```sh
   cd cli
   node cli.js <command>
   ```

### Testing
To run the tests for the backend and CLI, navigate to their respective directories and run:

```sh
npm test
```

---

Replace the placeholders like `your-repository-url`, `your-project-name`, and directory names (`backend`, `frontend`, `cli`) with the actual names used in your project. This setup guide assumes a standard Node.js project structure and should be adjusted according to your specific project setup and requirements.

## Diagrams

Explain how to access and interpret the Visual Paradigm diagrams included with the project.

## Contributing

Guidelines for how to contribute to the project. You can include instructions for forking, creating pull requests, and reporting bugs.

## License

Include the project's license. If you haven't chosen a license yet, you can find one that suits your project's needs at [Choose a License](https://choosealicense.com/).

---

### Tips for a Great README:

- **Clarity and Simplicity**: Keep the language simple and clear.
- **Consistency**: Use a consistent format throughout the document.
- **Detail-Oriented**: Include all necessary details, but avoid overwhelming the reader.
- **Visuals**: If possible, add screenshots or GIFs to demonstrate key features.
- **Updates**: Regularly update the README to reflect changes in the project.

Remember, the `README.md` is often the first thing users and potential contributors see, so it should be as informative and welcoming as possible.
