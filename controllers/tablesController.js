const { queryDB } = require("../util/queryDB");

async function deleteTable(req, res) {
  const query = {
    text: "DELETE FROM TABLES WHERE id=$1",
    values: [req.params.id],
  };
  const rows = await queryDB(query);
  res.send(rows);
}

async function updateTable(req, res) {
  try {
    const { occupied, orderId, location } = req.body
    const orderIDVal = orderId === undefined ? null : orderId
    const query = {
      text: "UPDATE TABLES SET occupied = COALESCE($1,occupied), order_id =$2, location=COALESCE($3,location) WHERE id = $4 RETURNING *",
      values: [occupied, orderIDVal, location, req.params.id],
    };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    console.error(error)
    res.send(400)
  }
}

async function addTable(req, res) {
  try {
    const query = {
      text: "INSERT INTO TABLES (id, occupied, order_id, location) VALUES ($1, false, NULL, $2) RETURNING *",
      values: [req.body.id, req.body.location],
    };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    if (error.code=='23505') res.status(400).send("This item already exists")
  }
}

async function getTables(req, res) {
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
}
module.exports = {
  deleteTable,
  updateTable,
  addTable,
  getTables,
};
