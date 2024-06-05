# Sample Userinfo Application

This application is built using Node.js and utilizes Prisma for database interactions.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Node.js version 14.x or later.
- You have a MySQL database running and accessible.

## Installation

To install the necessary dependencies, run the following command in your project directory:

```bash
npm install
```
Configuration
Create a .env file in the root of your project and update it with your database connection details. For example:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
AUTH_URL=https://auth-wallet.upbond.io
```

Database Setup
To set up your database schema and apply any migrations, run:
```bash
npm run migrate
npm run generate
```
Running the Application
To start the application, run:
```bash
npm start
```
This will start the server on the default port (usually 3000). You can access the application by navigating to http://localhost:3000 in your browser.

Additional Scripts
Generate Prisma Client: To generate or update the Prisma client, run npm run generate.
Linting: To lint your code, run npm run lint. This will check your code for any syntax errors or deviations from coding standards.
License
This project is licensed under the ISC License.


Ensure to replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` in the `.env` file example with your actual database connection details


name,
first_name,
last_name,
email,
phone,
birthdate
education_level
photo
gender
marital
_status
age
day_of_birth
month_of_birth
year_of_birth
zip
first name kana
last_name_kana
country
identities
connections
address
driver license
transportation
office
profession
income_range
household_number
children number
hobbies
housing_loan
insurance_number
mynumber
family_members
custom_data

string,len < 100
string,len < 50
string,len < 50
string,len < 50
string,email
string,phone
date,yууу-mm-dd
nvarchar (50),high school, university
binary(1000),_
string,men, women,others
boolean,_
integer,0 <, < 200
integer,1 - 31
integer,1 - 12
integer,1 - 9999
string,len < 50
string,len < 50
string,len < 50
string,ISO 3166-1
_,_
_,_
_,_
boolean,_
string,len < 50
string,len < 50
string,len < 50
_,_
integer, 0< and < 100
integer, 0<= and < 100
string[],_
boolean,_
string,[0,9]{12}
_,_
_,_