const crypto = require('crypto');

module.exports = {
  JWT_SET: crypto.randomBytes(30).toString('hex'),
}