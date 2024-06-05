const userParams = [
  "name",
  "first_name",
  "last_name",
  "age",
  "email",
  "address",
  "city",
  "phone",
  "language",
  "gender",
  "country",
  "picture",
  "birthdate",
  "birth_day",
  "birth_month",
  "birth_year",
  "identities",
  "connections",
  "profession",
  "postal_code",
  "marital_status",
  "driver_license",
  "transportation",
  "office",
  "income_range",
  "household_number",
  "children_number",
  "hobbies",
  "housing_loan",
  "insurance_number",
  "mynumber",
  "family_members",
  "custom_data",
];

/**
 * Merge two arrays by a specific parameter.
 *
 * @param {*} arr1
 * @param {*} arr2
 * @param {*} params
 * @return {*}
 */
function mergeArraysByParams(arr1, arr2, params) {
  const mergedArray = [...arr1];

  arr2.forEach((obj2) => {
    const match = mergedArray.find((obj1) => {
      return params.every((param) => obj1[param] === obj2[param]);
    });

    if (match) {
      const index = mergedArray.indexOf(match);
      mergedArray[index] = obj2;
    } else {
      mergedArray.push(obj2);
    }
  });

  return mergedArray;
}

// function isObject(param) {
//   return (
//     typeof param === "object" && param !== null && !(param instanceof Array)
//   );
// }

function serializeUserParams(body, user) {
  const userData = {
    custom_data: {},
  };


  // ignore id
  delete body.id;

  for (const b in body) {
    if (userParams.includes(b)) {
      userData[b] = body[b];
    } else {
      userData.custom_data[b] = body[b];
    }
  }

  const existingCustomData = user.custom_data || {};
  const existingFamilyMembers = user.family_members || [];
  const existingAddress = user.address || {};
  const existingIdentities = user.identities || [];

  userData.custom_data = {
    ...existingCustomData,
    ...userData.custom_data,
  };
  userData.family_members = mergeArraysByParams(existingFamilyMembers, userData.family_members || [], [
    "relationship",
  ]);
  userData.address = {
    ...existingAddress,
    ...userData.address,
  };
  userData.identities = mergeArraysByParams(existingIdentities, userData.identities || [], [
    "provider",
  ]);

  return userData;
}

function cleanJSON(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanJSON(item)).filter(Boolean); // Filter out null or empty objects
  } else if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = cleanJSON(obj[key]); // Recursively clean nested objects
        if (obj[key] === null || obj[key] === "") {
          delete obj[key]; // Delete properties with null or empty string values
        }
      }
    }
    return obj;
  } else {
    return obj;
  }
}

module.exports = {
  serializeUserParams,
  cleanJSON,
};
