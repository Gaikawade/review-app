const crypto = require('crypto');

exports.sendError = (res, err, statusCode = 401) => {
  res.status(statusCode).json({err});
}

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buffer) => {
      if(err) reject(err);
      const bufferString = buffer.toString('hex');

      console.log(bufferString);
      resolve(bufferString)
    })
  })
}