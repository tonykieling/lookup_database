const pg = require("pg");
const settings = require("./settings"); // settings.json

// receiving the parameters from the user
const [name] = process.argv.slice(2);

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});


// function to convert postgreSQL date to YYYY-MM-DD
function convertToDate(data) {
  const birthday = new Date(data);
  const year = birthday.getFullYear();
  const month = (birthday.getMonth() < 10)? ("0" + (birthday.getMonth() + 1)) : (birthday.getMonth() + 1);
  const day = (birthday.getDate() < 10)? ("0" + (birthday.getDate())) : (birthday.getDate());
  return(`${year}-${month}-${day}`);
}


// generic function to query the DB
function doQuery(client, query, values) {
  client.query(query, values, (err, res) => {
    if (err) {
      console.log(err);
      return false;
    }

    if (res.rows.length) {
      console.log(`Found ${res.rows.length} person(s) by the name ${values}:`);
      let count = 1;
      res.rows.forEach(famous_people => {
        const birthday = convertToDate(famous_people.birthdate);        
        console.log(`- ${count}: ${famous_people.first_name} ${famous_people.last_name}, born '${birthday}'`);    
        count += 1;
      });

    } else {
      console.log("No results found");
    }
    client.end();
  });
}


// function which receives the arguments to the query
function findFamous(client, data) {
  const query = "SELECT * FROM famous_people WHERE first_name=$1 OR last_name=$1";
  const values = [data];

  doQuery(client, query, values);
}


console.log('Searching...');
client.connect();
findFamous(client, name);
