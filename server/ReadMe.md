# InterviewPrep Server

This is the backend server for the InterviewPrep application. It handles the processing and storage of interview questions, answers, feedback, and user information.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.

## Database Models

### User Model
Contains the **username**, **password** (hashed) and a list of past mock **interview ID's** of the application.

### Interview Model
Contains the **company**, **position title**, **job posting description** and an array of **question ID's** (both behavioral and technical) created for this mock interview

### Question Model
Contains the OpenAI API (gpt-4o model) generated **questions** based on the user input of ompany, position title, job posting description and  an optional resume, **answers** entered by the user, and OpenAI generated **feedback** based on the user input of answer.   

### Resume Model
Contains the **username** and the parsed **resume** of the user.

# Setup and Running the Server

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine.
- **MongoDB**: Ensure MongoDB is installed and running.

## Installation

Clone the repository

```bash
git clone https://github.com/your-repo/interview-management-server.git
cd interview-management-server
