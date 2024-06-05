const crypto = require('crypto');

function encrypt(body, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    
    // Update the HMAC with the stringified body
    hmac.update(JSON.stringify(body));
    
    // Generate the signature by encoding the HMAC digest in base64
    const calculatedSignature = hmac.digest('base64');
    return calculatedSignature;
}

// Edit here to handle webhhok trigger from url and retry event
async function webhookAction(signature, client_secret, body) {
    // 署名を検証
    const calculatedSignature = encrypt(body, client_secret);

    if (signature === calculatedSignature) {
    // 署名が有効な場合、Webhookペイロードを処理
        // console.log("Webhook payload:", body);
        // CRUDアクション処理ロジックをここで実装
        return {
            status: 200,
            message: "Webhook received and verified",
        };
    } else {
    // 署名が無効な場合、リクエストを拒否
        return {
            status: 401,
            message: "Invalid signature",
        };
    }
}

module.exports = {
    webhookAction
};