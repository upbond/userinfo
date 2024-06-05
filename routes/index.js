const { getUser, createUser, deleteUser } = require("../services");
const { triggerWebhook } = require("../services/event");
const { verifyToken, validateSchema } = require("../controllers/middleware");
const { EVENT_TYPE } = require("../utils/constans");
const { webhookTrigger } = require("../services/webhook");

const router = require("express").Router();

router.get("/health", async (request, reply) => {
  reply.send({ status: "ok" });
});

router.get("/", async (req, res, next) => {
  res.status(200).json({
    message: "Server is live !!",
  });
  return next();
});

router.get("/userinfo", verifyToken, async (req, res, next) => {
  try {
    const loggedUser = res.locals.account;
    const customer = await getUser(loggedUser);
    await triggerWebhook(loggedUser, customer, EVENT_TYPE.GET_USER);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Error get a user",
      errors: [error.message]
    });
  }
  return next();
});

router.post("/userinfo", verifyToken, validateSchema, async (req, res, next) => {
  try {
    const body = req.body;
    const loggedUser = res.locals.account;
    const newId = await createUser(loggedUser, body);
    loggedUser.sub = newId;
    const customer = await getUser(loggedUser);

    await triggerWebhook(loggedUser, customer, EVENT_TYPE.CREATE_USER);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Error create a user",
      errors: [error.message]
    });
  }
  return next();
});

router.delete("/userinfo", verifyToken, async (req, res, next) => {
  try {
    const loggedUser = res.locals.account;
    const customer = await deleteUser(loggedUser);
    await triggerWebhook(loggedUser, customer, EVENT_TYPE.DELETE_USER);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Error delete a user",
      errors: [error.message]
    });
  }
  return next();
});

router.get(
  "/webhook",
  (async (req, res, next) => {
      const signature = req.headers['x-upbond-signature']; // ヘッダーから署名を取得
      const body = req.query; // リクエストボディを取得
      const result = await webhookTrigger(signature, body);
      res.status(result.status).json({
          message: result.message,
      });
      return next();
  })
);

router.post(
  "/webhook",
  (async (req, res, next) => {
      const signature = req.headers['x-upbond-signature']; // ヘッダーから署名を取得
      const body = req.body; // リクエストボディを取得
      const result = await webhookTrigger(signature, body);
      res.status(result.status).json({
          message: result.message,
      });
      return next();
  })
);

module.exports = router;
