const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
var fs = require("fs");
const dotenv = require("dotenv");
const { error } = require("console");
dotenv.config();

const dbInit = fs.readFileSync("tableinit.sql").toString();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 8080;

const client = new Client(process.env.DATABASE_URL);
client.connect((err, cl) => {
  cl.query(dbInit);
});

async function queryDB(query, values) {
  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

app.get("/status", (req, res) => res.send(client !== null));
app.get("/api/tables/:id?", async (req, res) => {
  try {
    const tableId = req.params.id;

    if (tableId) {
      const query = {
        text: "SELECT * FROM TABLES WHERE id = $1",
        values: [tableId],
      };
      const rows = await queryDB(query);
      res.send(rows);
    } else {
      const query = "SELECT * FROM TABLES";
      const rows = await queryDB(query);
      res.send(rows);
    }
  } catch (error) {
    console.error(error)
    res.status(400).send("Invalid request");
  }
});
app.post("/api/tables", async (req, res) => {
  try {
    const id = req.body.id;
    const query = {
      text: "INSERT INTO TABLES (id, occupied, order_id) VALUES ($1, false, NULL) RETURNING *",
      values: [id],
    };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    console.error(error)
    res.status(400).send("Invalid request");
  }
});
app.put("/api/tables/:id", async (req, res) => {
  try {
    const { occupied, orderID } = req.body;
    const orderIDVal = orderID === undefined ? null : orderID;

    const query = {
      text: "UPDATE TABLES SET occupied = $1, order_id = $2 WHERE id = $3 RETURNING *",
      values: [
        occupied,
        orderIDVal,
        req.params.id,
      ],
      };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    console.error(error)
    res.status(400).send("Invalid request");
  }
});
app.delete("/api/tables/:id", async (req, res) => {
    try {
        const query = {
            text: "DELETE FROM TABLES WHERE id=$1",
            values: [req.params.id]
        }
        const rows = await queryDB(query)
        res.send(rows)
    } catch (error) {
        console.error(error)
        res.status(400).send("Invalid request")
    }
})

app.listen(PORT);
