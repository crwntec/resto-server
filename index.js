const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors")
dotenv.config();

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 8080;

const tablesRouter = require("./routes/tables");
const ordersRouter = require("./routes/orders");
const itemsRouter = require("./routes/items");

app.use("/api/tables", tablesRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/items", itemsRouter)

app.get("/status", (req, res) => res.send("sta"));
app.listen(PORT);
