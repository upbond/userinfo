const crypto = require('crypto');

function encrypt(body, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    
    // Update the HMAC with the stringified body
    hmac.update(JSON.stringify(body));
    
    // Generate the signature by encoding the HMAC digest in base64
    const calculatedSignature = hmac.digest('base64');
    return calculatedSignature;
}

module.exports = {
    encrypt,
  };
  