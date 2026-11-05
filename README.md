Web Application


1. Requirements

Ensure the following are installed on your machine:

XAMPP with Apache and MySQL enabled

Node.js & npm

Web browser 


2. Project Directory Structure

C:\xampp\htdocs\IntroDB_Project1\
Backend\
	.env                 
	app.js               
	dbService.js         
	package.json         
	package-lock.json
    
Frontend\
	index.html          
	index.js             
	stylesheet.css      
	sql.txt                  
	README.md

3. Database Setup (MySQL & phpMyAdmin)

Launch the XAMPP Control Panel.

Start both the Apache and MySQL.

Open your browser and navigate to:

http://localhost/phpmyadmin/


Create a new database named:

web_app


Select the web_app database, open the SQL tab, and execute the following script to create the Users table:

CREATE TABLE Users (
    userid VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2),
    age INTEGER,
    registerday DATE NOT NULL,
    signintime DATETIME NULL
);


In the same SQL tab, populate the table with initial test records:

INSERT INTO Users (userid, password, firstname, lastname, salary, age, registerday, signintime) VALUES
    ('john', NULL, 'John', 'Carter', 185000.00, 32, '2026-01-10', '2026-10-20 09:15:00'),
    ('sarah', NULL, 'Sarah', 'Chen', 240000.00, 29, '2026-01-10', NULL),
    ('michael', NULL, 'Michael', 'Brooks', 315000.00, 41, '2026-01-15', '2026-10-21 10:30:00'),
    ('emily', NULL, 'Emily', 'Patel', 135000.00, 25, '2026-01-08', NULL),
    ('david', NULL, 'David', 'Kim', 275000.00, 36, '2026-02-01', '2026-10-22 14:45:00'),
    ('olivia', NULL, 'Olivia', 'Rivera', 205000.00, 30, '2026-01-15', '2026-10-23 11:00:00'),
    ('james', NULL, 'James', 'Wilson', 110000.00, 23, '2026-02-12', NULL),
    ('ava', NULL, 'Ava', 'Thompson', 385000.00, 44, '2026-03-05', '2026-10-24 16:20:00'),
    ('ethan', NULL, 'Ethan', 'Chen', 165000.00, 28, '2026-02-01', NULL),
    ('sophia', NULL, 'Sophia', 'Brooks', 295000.00, 38, '2026-03-05', '2026-10-25 08:30:00');


4. Backend Configuration & Compilation

Verify or create the .env configuration file in C:\xampp\htdocs\IntroDB_Project1\Backend\.env:

PORT=5050
DB_USER=root
PASSWORD=
DATABASE=web_app
DB_PORT=3306
HOST=localhost


Open PowerShell or Command Prompt, navigate to the Backend directory, and install dependencies:

cd xampp\htdocs\IntroDB_Project1\Backend
npm install


5. Deployment & Execution

Step 1: Start the Backend Server

From the Backend directory, start the application:

npm start


Expected terminal output:

HOST: localhost
DB USER: root
DATABASE: web_app
DB PORT: 3306
db connected
I am listening on the fixed port 5050.


Keep this terminal session running in the background.

Step 2: Access the Frontend

Navigate to:

http://localhost/IntroDB_Project1/Frontend/index.html


6. Testing Application Features

Requirement 1 (User Registration): Fill out all fields in the registration form. When submitted, the user is created with registerday = CURDATE() and signintime = NULL.

Requirement 2 (User Sign-In): Provide a registered userid and password. On success, the backend updates signintime to NOW().

Requirement 3 (Search by Name): Filter users by first name, last name, or both.

Requirement 4 (Search by ID): Look up an exact user profile by their unique userid.

Requirement 5 (Salary Range): Retrieve users within specified minimum and maximum salary bounds.

Requirement 6 (Age Range): Retrieve users within specified minimum and maximum integer age ranges.

Requirement 7 (Registered After Specified Person): List users who registered after a target person's registration date.

Requirement 8 (Never Signed In): List all users whose signintime is still NULL (displayed as 'Never').

Requirement 9 (Registered on Same Day): List users who share the same registration date as a targeted person.

Requirement 10 (Registered Today): Display all users who registered on the current calendar date (CURDATE()).
