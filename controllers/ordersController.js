const { queryDB } = require("../util/queryDB");

const getItemDetailsById = async (id) => {
  const query = {
    text: "SELECT * FROM ITEMS WHERE id = $1",
    values: [id],
  };
  const rows = await queryDB(query);
  return rows[0];
};

async function deleteOrder(req, res) {
  const query = {
    text: "DELETE FROM ORDERS WHERE id=$1",
    values: [req.params.id],
  };
  const rows = await queryDB(query);
  res.send(rows);
}

async function updateOrder(req, res) {
  const { table_id, item_ids, orderId } = req.body;
  try {
    const query = {
      text: "UPDATE ORDERS SET table_id = COALESCE($1,table_id), item_ids = COALESCE($2,item_ids) WHERE id = $3 RETURNING *",
      values: [table_id, item_ids, orderId],
    };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    res.send(400);
  }
}

async function addOrder(req, res) {
  const { table_id, item_ids, orderId } = req.body;;
  try {
    const query = {
      text: "INSERT INTO ORDERS (id, table_id, item_ids) VALUES ($1, $2, $3) RETURNING *",
      values: [orderId, table_id, item_ids],
    };
    const rows = await queryDB(query);
    res.send(rows);
  } catch (error) {
    console.error(error);
    if (error.code == "23505") res.status(400).send("This item already exists");
  }
}

async function getOrders(req, res) {
  const orderId = req.params.id;
  const query = orderId
    ? {
        text: "SELECT * FROM ORDERS WHERE id = $1",
        values: [orderId],
      }
    : "SELECT * FROM ORDERS";

  const rows = await queryDB(query);
  if (!orderId) {
    let orders = [];
    for (const order of rows) {
      const itemDetails = await Promise.all(
        order.item_ids.map(async (id) => await getItemDetailsById(id))
      );
      orders.push({
        orderId: order.id,
        table_id: order.table_id,
        items: itemDetails,
      });
    }
    res.send(orders);
    return;
  }
  const order = rows[0];

  if (!order) {
    res.send(500);
  }

  const itemDetails = await Promise.all(
    order.item_ids.map(async (id) => await getItemDetailsById(id))
  );
  res.send({
    orderId: order.id,
    table_id: order.table_id,
    itemDetails: itemDetails,
  });
}
module.exports = {
  deleteOrder,
  updateOrder,
  addOrder,
  getOrders,
};
