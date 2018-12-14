const crypto = require('crypto');

module.exports = (secret, signature, body) => {
  if (!secret) throw new Error('Missing Secret');
  if (!signature) throw new Error('Missing x-hub-signature');
  if (signature.body && signature.headers) {
    body = signature.body;
    signature = signature.headers['x-hub-signature'];
  }

  if (!signature) throw new Error('Missing x-hub-signature');
  if (!body) throw new Error('Missing request Body');
  
  const calculated = 'sha256=' + crypto.createHmac('sha256', secret).update(Buffer(body)).digest('hex');
  return signature === calculated;
};