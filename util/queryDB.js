const { Client } = require("pg");
var fs = require("fs");
const { stack } = require("../routes/tables");
const client = new Client(process.env.DATABASE_URL);
const dbInit = fs.readFileSync("tableinit.sql").toString();

client.connect((err, cl) => {
  console.log("connected to db")
  cl.query(dbInit);
});

async function queryDB(query, values) {
  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

module.exports = {
  queryDB,
};
