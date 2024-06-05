const { EVENT_STATUS, WEBHOOK_URL, CLIENT_SECRET } = require("../utils/constans");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const { encrypt } = require("./signature");

async function triggerWebhook(session, user, event_type) {
  const body = {
    "event_id": "uuid",
    "client_id": session.client_id,
    "type": event_type,
    "message": user,
    "timestamp": new Date().valueOf(), // new Date unix    
    "deliveryContext": {
      "isRedelivery": false
    }
  }

  const signature = await getSignature(body, session.client_id)
  if (!signature) {
    // dont trigger webhook url if no signature
    return;
  }

  const config = {
    url: WEBHOOK_URL,
    method: "POST",
    headers: {
      'x-upbond-signature': signature
    },
    data: body,
  };

  let id = null;
  try {
    const event = await addEvent(session.sub, body, event_type, session.client_id);
    id = event.id;
    await editEventStatus(id, EVENT_STATUS.ON_PROCESS);
    await axios.request(config);
  } catch (error) {
    const message =
      error.response && error.response.data
        ? error.response.data.message || error.message
        : error.message;
    await handleEventError(id, message);
    return;
  }
  await editEventStatus(id, EVENT_STATUS.SUCCESS);
}

async function addEvent(sub, data, event_type, client_id) {
  const result = await prisma.eventLog.create({
    data: {
      sub,
      data: data,
      event_type,
      status: EVENT_STATUS.QUEUE,
      client_id
    },
  });

  return result;
}

async function editEventStatus(id, status) {
  await prisma.eventLog.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

async function handleEventError(id, newError) {
  let eventLog = await prisma.eventLog.findFirst({
    where: { id },
  });

  const currentErrors = eventLog.errors || [];
  currentErrors.push({
    message: newError,
    date: new Date(),
  });

  await prisma.eventLog.update({
    where: {
      id,
    },
    data: {
      status: EVENT_STATUS.FAILED,
      errors: currentErrors
    },
  });
}

async function getClientSecret(client_id) {

  // static from env
  if (CLIENT_SECRET) {
    return CLIENT_SECRET;
  }

  // Dynamic client secret -> Not used
  const result = await prisma.clientCredential.findFirst({
      where: { client_id },
  });

  if (!result) {
      return null;
  }

  const client_secret = result.client_secret;
  return client_secret;
}

async function getSignature(body, client_id) {
  const client_secret = await getClientSecret(client_id);

  const signature = encrypt(body, client_secret);
  return signature;
}

module.exports = {
  triggerWebhook,
  getClientSecret
};
