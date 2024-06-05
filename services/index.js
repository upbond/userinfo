const { PrismaClient } = require("@prisma/client");
const { serializeUserParams, cleanJSON } = require("../utils/helper");

const prisma = new PrismaClient();

async function getUser(loggedUser) {
  try {
    if (!loggedUser.sub) {
      throw new Error("Not found");
    }
    // Create a user
    const user = await prisma.user.findFirst({
      where: { id: loggedUser.sub },
    });
    if (!user) {
      throw new Error("Not found");
    }
    const result = {
      ...user,
      ...(user.custom_data || {})
    };
    delete result.custom_data
    return cleanJSON(result);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteUser(loggedUser) {
  try {
    if (!loggedUser.sub) {
      throw new Error("Not found");
    }
    const user = await prisma.user.findFirst({
      where: { id: loggedUser.sub },
    });
    if (!user) {
      throw new Error("Not found");
    }
  
    // Delete a user
    await prisma.user.deleteMany({
      where: { id: loggedUser.sub },
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createUser(loggedUser, body) {
  // Attempt to find an existing user
  let id = loggedUser.sub;
  // handle to make id is did
  if (body.wallet_public_key) {
    id = `did:key:${body.wallet_public_key}`;
    // delete additional_data.custom_data.wallet_public_key; // TODO: should be removed
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: { id: loggedUser.sub },
    });

    if (body.email && loggedUser.email && loggedUser.email !== body.email) {
      throw new Error("Email is different");
    }

    // If the user exists, update it
    if (existingUser) {
      const additional_data = serializeUserParams(body, existingUser);
      const data = {
        name: loggedUser.name,
        ...additional_data,
      };
      await prisma.user.update({
        where: {
          id: existingUser.id, // Assuming there's an 'id' field in your user table
        },
        data,
      });
    } else {
      const additional_data = serializeUserParams(body, {});
      // If the user doesn't exist, create a new one

      await prisma.user.create({
        data: {
          id,
          ...additional_data,
        },
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }

  return id;
}

module.exports = {
  getUser,
  createUser,
  deleteUser,
};
