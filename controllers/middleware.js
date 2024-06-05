const jwt = require("jsonwebtoken");
const jwktopem = require("jwk-to-pem");
const { AUTH_URL } = require("../utils/constans");
const axios = require("axios");
const JoiBase = require("joi");
const JoiDate = require("@joi/date");

const Joi = JoiBase.extend(JoiDate);

async function fetchJWKS() {
  var url =
    process.env.NODE_ENV !== "test"
      ? `${AUTH_URL}/.well-known/jwks.json`
      : `https://auth-wallet.dev.upbond.io/.well-known/jwks.json`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching JWKS:", error);
    throw error;
  }
}

function getPublicKey(jwks, kid) {
  const keys = jwks.keys;
  const key = keys.find((key) => key.kid === kid && key.kty === "RSA");

  if (!key) {
    throw new Error("Public key not found");
  }

  const pem = jwktopem(key);
  return pem;
}

async function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    console.log('no token provided', req.headers)
    return res
      .status(403)
      .json("You don't have an authorization for this action !");
  }

  const tokens = req.headers.authorization.split("Bearer ");
  const token = tokens[tokens.length - 1];

  let verified = null;
  try {
    const jwks = await fetchJWKS();
    const decodedToken = jwt.decode(token, { complete: true });
    const publicKey = getPublicKey(jwks, decodedToken.header.kid);
    verified = jwt.verify(token, publicKey);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (verified) {
    const decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken && decodedToken.payload) {
      res.locals.account = {
        sub: decodedToken.payload.sub,
        client_id: decodedToken.payload.client_id,
      };
    } else {
        return res.status(400).json({
          message: "Invalid Token",
        });
    }
  }

  next();
}

async function validateSchema(req, res, next) {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      message: "No body provided",
    });
  }
  try {
    const schema = Joi.object({
      name: Joi.string().max(100),
      first_name: Joi.string().max(50),
      last_name: Joi.string().max(50),
      phone: Joi.string().max(50),
      birthdate: Joi.date().format("YYYY-MM-DD"),
      education_level: Joi.string().max(50).valid("high school", "university"),
      photo: Joi.binary().max(1000),
      gender: Joi.string().allow(null),
      marital_status: Joi.string().max(50),
      age: Joi.number().min(0).max(200),
      day_of_birth: Joi.number().integer().min(1).max(31),
      month_of_birth: Joi.number().integer().min(1).max(12),
      year_of_birth: Joi.number().integer().min(1).max(9999),
      zip: Joi.string().max(50),
      first_name_kana: Joi.string().max(50),
      last_name_kana: Joi.string().max(50),
      country: Joi.string().max(50),
      identities: Joi.array().items(
        Joi.object({
          provider: Joi.string().required(),
          id: Joi.string().required(),
        })
      ),
      connections: Joi.any(),
      address: Joi.object({
        postal_code: Joi.string().allow(null),
        country: Joi.string().allow(null),
        address_line1: Joi.string().allow(null),
        address_line2: Joi.string().allow(null),
        prefecture: Joi.string().allow(null),
        province: Joi.string().allow(null),
        state: Joi.string().allow(null),
        city: Joi.string().allow(null),
      }),
      driver_license: Joi.boolean(),
      transportation: Joi.string().max(50),
      office: Joi.string().max(50),
      profession: Joi.string().max(50),
      income_range: Joi.number().min(0).max(100),
      household_number: Joi.number().min(0).max(100),
      children_number: Joi.number().min(0).max(100),
      hobbies: Joi.array().items(Joi.string().max(50)),
      housing_loan: Joi.boolean(),
      insurance_number: Joi.string(),
      mynumber: Joi.string().pattern(/^\d{12}$/),
      family_members: Joi.array().items(
        Joi.object({
          relationship: Joi.string()
            .valid("father", "mother", "son", "daughter", "wife", "partner")
            .required(),
          birthdate: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .allow(null),
        })
      ),
      custom_data: Joi.object(),
    }).unknown(true);
    await schema.validateAsync(body);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  next();
}

module.exports = {
  verifyToken,
  validateSchema,
};
