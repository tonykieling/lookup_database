const settings = require("./settings"); // settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : settings.host,
    user : settings.user,
    password : settings.password,
    database : settings.database,
  }
});


// receiving the parameters from the user
const [first_name, last_name, birthdate] = process.argv.slice(2);
if (!first_name && !second_name && !birthdate) {
  console.log('run: node add_person.js <first_name> <last_name> <YYYY-MM-DD> -> this is birthdate');
  return 0;
}
console.log("first_name: ", first_name);
console.log("last_name: ", last_name);
console.log("birthdate: ", birthdate);



console.log('Adding...');


knex('famous_people').insert({
  first_name,
  last_name,
  birthdate}
).asCallback((err, rows) => {
  if (err) return(console.log(err))

  console.log("Success");
  
  knex.destroy();
});