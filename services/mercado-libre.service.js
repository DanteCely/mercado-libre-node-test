const https = require('https');

const makeRequestByURL = async (endpoint) => {
  return new Promise((resolve, reject) => {
    const req = https.get(endpoint, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        resolve(response);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

module.exports = { makeRequestByURL };
