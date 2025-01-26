# THE DUNK WEB

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Code Structure](#code-structure)
- [Prisma ERD](#prisma-erd)
- [Web Structure](#web-structure)
- [Power Up Instructions](#power-up-instructions)

## Introduction

This project is a full-stack web application with a backend built using Node.js and Prisma, and a frontend built using Next.js. The backend handles the server-side logic and database interactions, while the frontend provides a responsive user interface.

## Features

- User authentication (login, logout, password reset)
- Article management (create, read, update, delete)
- Real-time updates with WebSockets
- Hot module replacement for development
- Responsive design with Tailwind CSS

## Code Structure

### Backend
```sh
Backend/ 
  ├── .env 
  ├── .gitignore 
  ├── package.json 
  ├── prisma/ 
  │ ├── migrations/
  │ └── schema.prisma 
  ├── README.md 
  └── src/ 
    ├── config/ 
    ├── controllers/
    ├── db/
    ├── index.js
    ├── middleware/
    ├── routes/
    └── utils/
```

## Prisma ERD
![ERD](https://fnuiabv.stripocdn.email/content/guids/CABINET_3fba15a3138c6a8c8f3516264de8dbffb493b1e3b9cb1dbb7fd77e15ee3eba61/images/image.png)


## Web Structure

The web application consists of a backend and a frontend. The backend is responsible for handling API requests, database interactions, and authentication. The frontend is built with Next.js and provides a responsive user interface.

## Power Up Instructions

1. Clone the repository:

   ```sh
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies
    ```sh
    cd Backend
    npm install
    ```

3. Set up the database using Prisma:
    ```sh
    npx prisma migrate dev
    ```
    
4. Start the backend server:
    ```sh
    npm start
    ```

5. Navigate to the frontend directory and install dependencies:
    ```sh
    cd ../Frontend
    npm install
    ```

6. Start the frontend development server:
    ```sh
    npm run dev
    ```

How to Run the Code
Ensure that both the backend and frontend servers are running.
Open your browser and navigate to http://localhost:3000 to access the frontend.
Use the provided user interface to interact with the application.

Enjoy your development!
