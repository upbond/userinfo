const { webhookAction } = require("../sample/webhook_receptor_sample");
const { getClientSecret } = require("./event");
const { encrypt } = require("./signature");

async function webhookSvc(body, client_id) {
    const client_secret = await getClientSecret(client_id);
    const signature = encrypt(body, client_secret);
    if (!signature) {
        return {
            status: 401,
            message: "Invalid signature",
        };
    }
    
    return webhookAction(signature, client_secret, body);
}

async function webhookTrigger(signature, body) {
    const client_secret = await getClientSecret(body.client_id);
    if (!signature) {
        return {
            status: 401,
            message: "Invalid signature",
        };
    }
    
    return webhookAction(signature, client_secret, body);
}

module.exports = {
    webhookSvc,
    webhookTrigger
};