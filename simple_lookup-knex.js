const settings = require("./settings"); // settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : settings.host,
    user : settings.user,
    password : settings.password,
    database : settings.database,
    // port: settings.port,
    // ssl: settings.ssl
  }
});


// receiving the parameters from the user
const [name] = process.argv.slice(2);
if (!name) {
  console.log('Please inform the name');
  return 0;
}


// function to convert postgreSQL date to YYYY-MM-DD
function convertToDate(data) {
  const birthday = new Date(data);
  const year = birthday.getFullYear();
  const month = (birthday.getMonth() < 10)? ("0" + (birthday.getMonth() + 1)) : (birthday.getMonth() + 1);
  const day = (birthday.getDate() < 10)? ("0" + (birthday.getDate())) : (birthday.getDate());
  return(`${year}-${month}-${day}`);
}


console.log('Searching...');

knex('famous_people')
  .where('first_name', name)
  .orWhere('last_name', name)
  .asCallback(function(err, rows) {
    if (err) return(console.error(err));

    console.log(`Found ${rows.length} person(s) by the name ${name}:`);
    let count = 1;
    rows.forEach(row => {
      console.log(`- ${count}: ${row.first_name} ${row.last_name}, born '${convertToDate(row.birthdate)}'`);
      count += 1;
    })
    knex.destroy();
  })
