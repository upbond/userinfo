# Database Migration Scripts

These scripts are designed to help you import data into a target database from either a CSV file or another database.

## Prerequisites

Before running these scripts, ensure you have the following:

- Node.js installed on your machine
- Access to both the source and target databases
- Necessary permissions to read from the source and write to the target databases

## Installation

1. Clone this repository to your local machine and install dependencies:

```bash
git clone <repository-url>
cd sample_userinfo
npm install
npm run generate-all

```

2. Update table schema on `schema_source.prisma` on model User
    - define one by one column name and attributes
    - change "user" on @@map to the user table name


## Usage
### Import CSV Data (cs_import.js)

1. Ensure you have a CSV file containing the data you want to import.
2. Add source.csv file into scripts folder 
or 
modify the `cs_import.js` script to specify the correct file path:
```javascript
const filePath = '/path/to/source.csv';
```
3. Run the script using Node.js:
```bash
npm run import:csv
```

### Migrate Data between Databases (db_import.js)

1. Ensure you have access to both the source and target databases.
2. Update the SOURCE_DATABASE_URL and DATABASE_URL in .env to reflect the database connection URLs.
```
# .env
...
SOURCE_DATABASE_URL=mysql://user:password@mysourcedburl.com:3306/userinfo-source
DATABASE_URL=mysql://user:password@mytargetdburl.com:3306/userinfo-target

```
3. Modify the columnMappings object to map columns from the source table to the target table.
change the value on right based on source column name

4. Run the script using Node.js:
```bash
npm run import:db
```
#### Notes
Everytime `schema_source.prisma` changed, please run again
```bash
npm run generate-all
```