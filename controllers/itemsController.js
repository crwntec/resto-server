const { queryDB } = require("../util/queryDB");

async function deleteItem(req, res) {
  const query = {
    text: "DELETE FROM ITEMS WHERE id=$1",
    values: [req.params.id],
  };
  const rows = await queryDB(query);
  res.send(rows);
}

async function updateItem(req, res) {
    const { name, price } = req.body;
  try {
    const query = {
      text: "UPDATE ITEMS SET name = COALESCE($1,name), price = COALESCE($2,price) WHERE id = $3 RETURNING *",
      values: [name, price, req.params.id],
      };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
      console.error(error);
    res.sendStatus(400);
  }
}

async function addItem(req, res) {
  const { name, price } = req.body;
  console.log(req.body);
  try {
    const query = {
      text: "INSERT INTO ITEMS (name, price) VALUES ($1, $2) RETURNING *",
      values: [name, price],
    };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    console.error(error);
    if (error.code == "23505") res.status(400).send("This item already exists");
  }
}

async function getItems(req, res) {
  const ItemId = req.params.id;
  const query = ItemId
    ? {
        text: "SELECT * FROM ITEMS WHERE id = $1",
        values: [ItemId],
      }
    : "SELECT * FROM ITEMS";
  const rows = await queryDB(query);
  res.send(rows);
}
module.exports = {
  deleteItem,
  updateItem,
  addItem,
  getItems,
};
