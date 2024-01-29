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
  - [Front-End](#front-end)
  - [Back-End](#back-end)
  - [CLI Client](#cli-client)
  - [Testing](#testing)
- [Diagrams](#diagrams)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

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

---

### Libraries and Dependencies

#### Backend (REST API)

- **bcrypt**: `^5.1.1`
- **body-parser**: `^1.20.2`
- **cors**: `^2.8.5`
- **dotenv**: `^16.3.1`
- **express**: `^4.18.2`
- **fs**:`^0.0.1-security`
- **https**: `^1.0.0
- **json2csv**: `^6.0.0-alpha.2`
- **jsonwebtoken**: `^9.0.2`
- **multer**: ^1.4.5-lts.1`
- **mysql2**: `^3.6.5`
- **path**:`^0.12.7`
- **readline**: `^0.12.7`
- **swagger-jsdoc**: `^1.3.0`
- **swagger-ui-express**: `^5.0.0`
- **ws**: `^8.16.0`
- **yamljs**: `^0.3.0`
- **Dev Dependencies**:
  - **nodemon**: `^3.0.3`

### Frontend (Next.js)

- **@emotion/react**: `^11.11.3`
- **@emotion/styled**: `^11.11.0`
- **@mui/icons-material**: `^5.15.3`
- **@mui/lab**: `^5.0.0-alpha.159`
- **@mui/material**: `^5.15.3`
- **next**: `^14.0.4`
- **react**: `^18`
- **react-dom**: `^18`
- **react-material-ui-carousel**: `^3.4.2`
- **react-router-dom**: `^6.21.1`
- **react-slick**: `^0.29.0`
- **slick-carousel**: `^1.8.1`
- **url**: `^0.11.3`

### CLI Client

- **axios**: `^1.6.4`
- **commander**: `^11.1.0`
- **csv-parse**: `^5.5.3`
- **csv-parser**: `^3.0.0`
- **form-data**: `^4.0.0`
- **request**: `^2.88.2`
- **yargs**: `^17.7.2`
- **Dev Dependencies**:
  - **jest**: `^29.7.0`
  - **nock**: `^13.4.0`
  - **shelljs**: `^0.8.5`

### Testing Tools

- **Jest**: `^29.7.0`
- **Supertest**: For HTTP request testing.


### Setting Up the Environment

Provide instructions for setting up the local development environment. Include steps for setting up the database and any environment variables.

```bash
# Example of environment setup commands
cp .env.example .env
```

## Usage

Detailed instructions on how to use each component of the project.

### Front-End

Instructions to run the Next.js front-end.

```bash
# Running the front-end
npm run dev
```

### Back-End

Steps to start the Node.js API server.

```bash
# Starting the back-end server
npm start
```

### CLI Client

How to use the CLI client, including example commands.

```bash
# Example CLI command
se2321 adduser --username user --passw pass
```

### Testing

Instructions for running functional tests for the API and CLI client.

```bash
# Running tests
npm test
```

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
