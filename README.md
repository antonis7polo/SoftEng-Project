# Ntuaflix

## Project Overview

Ntuaflix is a comprehensive platform designed to aggregate and present detailed metadata about films and television series. This project was developed as part of the Software Engineering course at ECE NTUA, aimed at showcasing our ability to design and implement a full-stack application.

## Contributors

This project is the result of collaborative efforts by a team of aspiring software engineers:

- **Antonios Alexiadis el20167@mail.ntua.gr** - Dedicated to frontend development and user interface design, with additional involvement in documentation.
- **Nikolaos Bothos Vouterakos el20158@mail.ntua.gr** - Oversaw project management and led testing initiatives, while also contributing to frontend development.
- **Chrisostomos Kopitas el20136@mail.ntua.gr** - Specialized in the development of the database and management of data.
- **Charidimos Papadakis el20022@mail.ntua.gr** - Concentrated on API development and also contributed to the CLI client.

## Description
Ntuaflix is an innovative platform meticulously crafted for cinephiles and industry professionals, functioning as a comprehensive repository of metadata for films and television series. This dynamic platform primarily focuses on providing in-depth information, such as detailed synopses, extensive cast and crew lists, genre classifications and ratings. It stands out by offering personalized recommendations, tailored to enhance the users' exploration and discovery of cinematic content.

While Ntuaflix does not directly host film content, it excels in providing an enriched cinematic experience through its vast array of metadata and bespoke suggestions. The platform aims to elevate the user's engagement with cinema by offering detailed insights and information, making it an indispensable tool for both movie enthusiasts and professionals in the film industry. Whether it's uncovering hidden cinematic gems or keeping up-to-date with popular trends, Ntuaflix is the quintessential guide to the ever-evolving world of cinema.


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Back-End](#back-end)
  - [API Documentation](#api-documentation)
  - [Front-End](#front-end)
  - [CLI Client](#cli-client)
  - [Testing](#testing)
- [Diagrams](#diagrams)
- [AI Assistance Log](#ai-assistance-log)

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


## Usage

## Cloning the Repository

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/ntua/softeng23-21
   ```

2. Navigate to the project directory:

   ```sh
   cd softeng23-21
   ```
3. Install the necessary Node.js packages:

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

    Within the MySQL shell, run the following command, replacing `path_to_ntuaflix_db.sql` with the actual path to the SQL file provided with the project:

    ```sql
    SOURCE path_to_ntuaflix_db.sql;
    ```

3. Add constraints to the Ntuaflix database:

    Still within the MySQL shell, execute the following command, replacing `path_to_ntuaflix_db_constraints.sql` with the path to the constraints SQL file:

    ```sql
    SOURCE path_to_ntuaflix_db_constraints.sql;
    ```

4. Add indexes to the Ntuaflix database:

    Still within the MySQL shell, run the following command, replacing `path_to_ntuaflix_db_index.sql` with the path to the index SQL file:

    ```sql
    SOURCE path_to_ntuaflix_db_index.sql;
    ```
5. Add data to the Ntuaflix database:
   
   Lastly, run the following command, replacing `path_to_ntuaflix_db_data.sql` with the path to the data SQL file:

    ```sql
    SOURCE path_to_ntuaflix_db_data.sql;
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

### Setting Up Environment Variables
---
To run the API, you need to set environment variables. Create a `.env` file in the root of the RESTful-API directory and configure the following variables:

1. **Database Configuration:**
    - `DB_HOST`: The hostname of your database server (e.g., `localhost`).
    - `DB_PORT`: The port number on which your database is running (e.g., `3306` for MySQL).
    - `DB_USER`: Your database username (e.g., `root`).
    - `DB_PASS`: Your database password.
    - `DB`: The name of the database you are using (e.g., `IMDb`).

2. **SSL Certificate Paths:**
    - `KEY_PATH`: The file path to your SSL key (e.g., `/Users/username/key.pem`).
    - `CERT_PATH`: The file path to your SSL certificate (e.g., `/Users/username/cert.pem`).
    - `KEY_PASSPHRASE`: The passphrase for your SSL key, if it is encrypted (e.g., `YourKeyPassphrase`).

      Details for SSL Certificates are provided below.

3. **JWT Secret:**
    - `JWT_SECRET`: A secret key for JSON Web Token (JWT) generation. It can be any string, preferably a complex and unique one (e.g., `V3ryS3cr3tK3y!2023`).


Here is a sample `.env` file for reference:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB=IMDb
KEY_PATH=/path/to/your/key.pem
CERT_PATH=/path/to/your/cert.pem
KEY_PASSPHRASE=YourKeyPassphrase
JWT_SECRET=YourSecretKey
```


### Setting Up Self-Signed SSL Certificates
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
    - If your `key.pem` file is encrypted, also ensure you have the passphrase used for the encryption.
    - Update your `.env` file to include the paths to these files, and the passphrase if your key is encrypted. For example:

      ```plaintext
      KEY_PATH=/path/to/your/key.pem
      CERT_PATH=/path/to/your/cert.pem
      KEY_PASSPHRASE=YourKeyPassphrase
      ```

    - Make sure the paths are correct and point to where you've stored your key and certificate files.

3. **Important Notes:**
    - Self-signed certificates are suitable for development and testing but are not recommended for production environments. For production, consider obtaining certificates from a trusted Certificate Authority (CA).
    - Keep your private key (`key.pem`) secure and do not share it publicly.

After setting up the SSL certificates, ensure that the other necessary environment variables are also configured in your `.env` file as described in the previous section.

## API Documentation

### Overview
---
The NTUAflix API is comprehensively documented using the OpenAPI 3.0 specification, providing details about all available API endpoints, parameters, and response structures.

### OpenAPI Specification
---
Our API specification is available in an `openapi.yaml` file and includes:

- **General Information**: Title, description, and version of the API.
- **Servers**: URLs where the API is hosted.
- **Paths**: Descriptions of all API endpoints, their methods, parameters, and response schemas.

### Accessing the Documentation
---
#### Local File
---
The `openapi.yaml` file is located in the root directory of our API project (RESTful-API). You can use tools like [Swagger UI](https://swagger.io/tools/swagger-ui/) or [Redoc](https://github.com/Redocly/redoc) to visualize and interact with the API's resources.

#### Online Access
---
For a more interactive experience, the API documentation is also accessible via a web interface at:

[https://localhost:9876/api-docs/](https://localhost:9876/api-docs/)

This URL hosts a user-friendly version of our API documentation, allowing you to easily explore and test the API endpoints. 

**Important Note:** In order to access this web interface, ensure that the server hosting the API is currently running. The documentation and interactive features will be available only when the server is active. Details on how to start and manage the server are provided below.


## Front-End 
1. Navigate to the frontend directory from the root of the project:

   ```sh
   cd /path/to/front-end/ntuaflix
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
   - Add the paths to your SSL certificate and key, and the passphrase for your key if it is encrypted, in the `.env` file. This is similar to what you did for the backend. For example:

     ```plaintext
     KEY_PATH=/path/to/your/key.pem
     CERT_PATH=/path/to/your/cert.pem
     KEY_PASSPHRASE=YourKeyPassphrase
     ```

   - Make sure the paths and the passphrase (if your key is encrypted) correctly point to the SSL certificate, key files, and the passphrase on your machine.

3. **Security Note:**
   - As with the backend, self-signed certificates are suitable for development and testing but not recommended for production. In a production environment, use certificates from a trusted CA.
   - Keep your private key secure and do not expose it in your public code repositories.

By configuring the frontend to recognize and use the SSL certificates, you ensure secure communication with the backend API, especially important when handling sensitive data or authentication information.


## CLI Client 
The project includes a Command Line Interface (CLI) client, which allows interaction with the backend API via command line. The CLI is accessed through the command `se2321`.

1. Navigate to the CLI directory:

   ```sh
   cd ../../cli-client
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


## Initial User Creation Requirement

**Important: To gain access to the system, it's mandatory to create an initial user.** This process is facilitated by the `createUsers.js` script located in the RESTful-API folder. The script uses bcrypt for secure password hashing and MySQL for database interaction. Follow the instructions below to set up your first user.

### How to Create the First User
---
1. Open a terminal or command prompt.
2. Navigate to the RESTful-API folder where the `createUsers.js` script is located.
3. Run the following command:

   ```bash
   node createUsers.js [username] [email] [password]
   ```

   Replace `[username]`, `[email]`, and `[password]` with your desired username, email address, and password, respectively. 

   Example:

   ```bash
   node createUsers.js myUsername newemail@example.com el20xxx
   ```


## Running the Application
1. Start the backend server:

   ```sh
   cd /path/to/back-end/RESTful-API
   node server.js
   ```

   This will start the backend server, typically running on `https://localhost:9876`.

2. In a new terminal, start the frontend application:

   ```sh
   cd /path/to/front-end/ntuaflix
   node server.js
   ```

   The frontend should now be accessible at `https://localhost:3000`.

3. Use the CLI client directly by using the se2321 command as described previously.

## Testing

## API Functional Testing

### Overview
---

As part of ensuring the robustness and reliability of the Ntuaflix API, we have implemented comprehensive functional testing using Postman. This testing process covers a wide range of scenarios to validate the functionality, performance, and security of our API endpoints.

### Postman Testing Details
---
The Postman tests for the Ntuaflix API include:

- **Endpoint Descriptions**: Detailed information about each endpoint, including its purpose and functionality.
- **Test Scenarios**: Multiple scenarios for each endpoint, such as successful operations, handling of invalid input, and server error responses.
- **Request Specifications**: Detailed request structures, including HTTP methods, headers, body parameters, and URL configurations.
- **Response Validation**: Tests to validate response status codes, response times, content types, and the structure of the response body.
- **Environment Variables**: Use of variables like `{{baseUrl}}`, `{{username}}`, and `{{password}}` to enable flexible testing across different environments.
- **Response Examples**: Sample responses for different test cases to provide a clear expectation of API outputs.

### Importing the Collection
---
To use the Postman collection for testing:

1. Download the provided JSON file from our repository(API Testing folder).
2. Import the collection into Postman.
3. Configure the environment variables as per your setup.
4. Execute the tests to validate API endpoint behaviors. Ensure that the server is running.

### Conclusion
---
These tests are integral to our development workflow, helping us to maintain high standards of quality and reliability for the Ntuaflix API. We encourage developers and testers to utilize this collection for a thorough understanding and verification of the API's capabilities.

## CLI Client Testing 

### Overview
---
Our project adopts a comprehensive testing strategy that includes both functional and unit testing to ensure the CLI client operates reliably and correctly. Functional tests are situated in the `__tests__/functional` directory, and unit tests are located in the `__tests__/unit` directory within the `cli-client` folder. This approach guarantees thorough validation of each component and command the CLI client offers.

### Testing Framework and Libraries
---
We leverage Jest as our primary testing framework for both functional and unit tests. For functional testing, ShellJS is utilized to execute CLI commands, simulating real-world usage scenarios and validating expected outcomes like exit codes, error messages, and success messages. For unit testing, we employ Jest's mocking capabilities to isolate and test individual units of code effectively.

### Executing the Tests
---
To execute the CLI client tests, navigate to the `cli-client` directory. The `package.json` file defines scripts to run functional tests, unit tests, or both. The testing scripts are designed to accommodate the authentication dependency present in functional tests, allowing for sequential execution with necessary login steps between tests.

Here's an overview of the test scripts in `package.json`:

```json
"scripts": {
  "test:functional": "jest __tests__/functional/login.test.js && jest __tests__/functional/logout.test.js && ...",
  "test:unit": "jest __tests__/unit/",
  "test": "npm run test:functional && npm run test:unit"
}
```

To run all tests, use the following command:

```sh
npm test
```

To execute only functional or unit tests, use:

```sh
npm run test:functional
npm run test:unit
```

These commands will execute the test suites as specified, allowing for targeted testing of functional or unit aspects as needed.

### Contributing to Tests
---
Contributions to the test suite are highly encouraged, especially when adding new features or fixing bugs. Please ensure to include corresponding functional or unit tests as applicable. This practice helps maintain and enhance the CLI client's reliability and quality.

### Test Configuration
---
Our test configuration is outlined in the `jest.config.js` file, setting the test environment to Node.js to mirror the CLI client's operational environment closely.

### Adding More Tests
---
The testing suite is designed to be extensible. Users wishing to add more functional tests can do so by appending additional test files to the `test:functional` script in `package.json`. This flexibility ensures comprehensive coverage as the CLI client evolves.

## Diagrams

### Overview
---
In our project documentation, we have utilized Visual Paradigm to create a comprehensive set of diagrams. These diagrams provide a detailed visual representation of various aspects of the Ntuaflix system, aiding in understanding the design, architecture, and functionality of the platform.

### Types of Diagrams and Their Purposes
---
We have included the following diagrams:

1. **Requirements Diagram**: This diagram visually represents the system requirements, helping to clarify and communicate the functional and non-functional requirements of the Ntuaflix platform.

2. **UML Use Case Diagram**: Illustrates the interactions between users (actors) and the system, showcasing different user scenarios and how the system responds to user actions.

3. **Entity-Relationship (ER) Diagram**: Depicts the database schema and relationships between different data entities. It is crucial for understanding the data model and the underlying structure of the database.

4. **UML Activity/State Diagram**: Shows the workflow or the sequence of activities in the system, highlighting the states of various entities through different operations.

5. **UML Class/API Diagram**: Provides an overview of the system's classes, their attributes, methods, and the relationships between them. This is particularly useful for understanding the API structure and object-oriented design of the system.

6. **UML Sequence Diagram**: Illustrates the sequence of messages exchanged between different objects or components of the system in a particular scenario, which is key for understanding the interaction and timing between system components.

7. **UML Deployment Diagram**: Demonstrates how the software is deployed on the hardware architecture, showing the physical configuration of hardware nodes and their software counterparts.

8. **UML Component Diagram**: Outlines the organization and dependencies among a set of components, which include software components, libraries, packages, files, etc.

### Accessing the Diagrams
---
These diagrams are available in the `documentation` folder within our project repository. 

### Usage
---
These diagrams serve as an essential reference for developers, architects, and project managers. They are instrumental in onboarding new team members, conducting system audits, and facilitating discussions about system enhancements and maintenance.

## AI Assistance Log

### Overview
---
In our development process, we have incorporated AI tools for assistance in various phases of the project. The `ai-log` folder in our repository is a dedicated space for documenting these interactions.

### Contents of the AI Log
---
The `ai-log` folder contains several zip files, each representing a different instance of interaction with an AI tool. Inside each zip file, you will find:

- **Text File (`.txt`) Containing the Prompt**: This file includes the exact prompt we used with the AI tool. It serves as a record of our query or request, providing context for the AI's response.

- **Corresponding JSON File**: Alongside each text file, there's a JSON file that contains the AI's response to our prompt. This structured format makes it easy to review and analyze the AI's output.

For instance, a zip file could contain:

1. `architecture_decision_prompt.txt` - The text of our query about architectural decision-making.
2. `architecture_decision_response.json` - The AI-generated response, offering insights or solutions based on the prompt.

### Example JSON Record
---
Each AI interaction is also summarized in a JSON record format like the following:

```json
{
    "answers": {
        "phase":  "architecture",
        "action":  "architectural decision",
        "scope":   "uml component",
        "action experience":  "fair",
        "prog lang": "n/a",
        "other prog lang": "<fill in>",
        "tool": "chat gpt 4.x",
        "other tool": "<fill in>",
        "tool option": "full",
        "tool experience": "enough",
        "time allocated (h)": "3",
        "time saved estimate (h)": "3",
        "quality of ai help":  "minor modifications needed",
        "generic feeling":  "great in the future",
        "notes": "Used the tool to generate a component and a deployment diagram, understanding how the front end can be deployed and how the different components interact with each other."
    }
}
```

This file provides a structured summary of the interaction, detailing the context, tools used, time invested, and the perceived quality and impact of the AI's assistance.

### Purpose and Use
---
The AI log serves to:

- **Document AI Interactions**: It offers a transparent account of how AI tools were used during the development of Ntuaflix.
- **Analyze AI's Effectiveness**: By reviewing these logs, we can assess the impact and efficiency of AI assistance in our project.
- **Inform Future Projects**: These logs act as a learning tool for future teams to understand the potential and limitations of AI in software development processes.

By meticulously documenting our AI interactions, we aim to provide insights into the integration of AI in software engineering and its evolving role.




