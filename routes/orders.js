const express = require("express");
const router = express.Router();
const {
  addOrder,
  updateOrder,
  getOrders,
  deleteOrder,
} = require("../controllers/ordersController.js");

router.post("/", addOrder);
router.put("/:id", updateOrder);
router.get("/:id?", getOrders);
router.delete("/:id", deleteOrder);

module.exports = router;
