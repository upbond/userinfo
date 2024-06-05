// importScript.js

const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importCSV(filePath) {
  try {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await prisma.user.create({
            data: {
              wallet_address: "",
              email: row.email_address,
              name: row.name,
              first_name: "",
              last_name: "",
              phone: row.tel,
              birthdate: "",
              education_level: "",
              photo: row.image,
              gender: "",
              marital_status: "",
              age: "",
              day_of_birth: "",
              month_of_birth: "",
              year_of_birth: "",
              zip: row.zip_code,
              first_name_kana: "",
              last_name_kana: "",
              country: row.country,
              language: "",
              identities: [],
              connections: "",
              address: {},
              driver_license: "",
              transportation: "",
              office: "",
              profession: row.occupation,
              income_range: "",
              household_number: "",
              children_number: "",
              hobbies: "",
              housing_loan: "",
              insurance_number: "",
              mynumber: "",
              family_members: [],
              custom_data: {},
            },
          });
        }

        console.log("CSV data imported successfully.");
        await prisma.$disconnect();
      });
  } catch (error) {
    console.error("Error importing CSV:", error);
    await prisma.$disconnect();
  }
}

const filePath = "./scripts/source.csv";
importCSV(filePath);
