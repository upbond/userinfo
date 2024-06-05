const { PrismaClient: PrismaClientSource } = require('../prisma/generated/source')
const { PrismaClient } = require('@prisma/client');

const prismaSource = new PrismaClientSource();
const prismaTarget = new PrismaClient();

// Define column mappings
const columnMappings = {
    // target_column: source_column
    // change the value on right based on source column name
    wallet_address: null,
    email: 'email_address',
    name: 'name',
    first_name: null,
    last_name: null,
    phone: 'tel',
    birthdate: null,
    education_level: null,
    photo: 'image',
    gender: null,
    marital_status: null,
    age: null,
    day_of_birth: null,
    month_of_birth: null,
    year_of_birth: null,
    zip: 'zip_code',
    first_name_kana: null,
    last_name_kana: null,
    country: 'country',
    language: null,
    identities: null,
    connections: null,
    address: null,
    driver_license: null,
    transportation: null,
    office: null,
    profession: 'occupation',
    income_range: null,
    household_number: null,
    children_number: null,
    hobbies: null,
    housing_loan: null,
    insurance_number: null,
    mynumber: null,
    family_members: null,
    custom_data: null,
};

async function migrateData() {
  try {
    // Connect to source database
    await prismaSource.$connect();

    // Connect to target database
    await prismaTarget.$connect();

    // Query data from the source table
    const sourceData = await prismaSource.user.findMany();

    // Transform and insert data into the target table
    for (const row of sourceData) {
      const data = {};
      // Map columns using the defined mappings
      for (const [targetColumn, sourceColumn] of Object.entries(columnMappings)) {
        if (sourceColumn !== null) {
            data[targetColumn] = row[sourceColumn];
            if (targetColumn === "address" && typeof row[sourceColumn] === "string") {
              data[targetColumn] = {"address_line1":`${row[sourceColumn]}`}
            }
        } else {
          if ((targetColumn === "identities" || targetColumn === "family_members")) {
            data[targetColumn] = []
          }
          else if ((targetColumn === "custom_data" || targetColumn === "address")) {
            data[targetColumn] = []
          }
        }
      }
      // Insert data into the target table
      await prismaTarget.user.create({ data });
    }

    console.log('Migration successful');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Disconnect from both databases
    await prismaSource.$disconnect();
    await prismaTarget.$disconnect();
  }
}

// Run migration
migrateData();
