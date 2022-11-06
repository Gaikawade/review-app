const crypto = require('crypto');

exports.sendError = (res, err, statusCode = 401) => {
  res.status(statusCode).json({err});
}

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {

      if(err) reject(err);
      const bufferString = buff.toString('hex');
      // console.log(bufferString);
      resolve(bufferString);
    })
  })
}