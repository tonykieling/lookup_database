const settings = require("./settings"); // settings.json

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host : settings.host,
      user : settings.user,
      password : settings.password,
      database : settings.database,
    }
  }
};
