const express = require("express");
const router = express.Router();
const {
  addItem,
  updateItem,
  getItems,
  deleteItem,
} = require("../controllers/itemsController.js");

router.post("/", addItem);
router.put("/:id", updateItem);
router.get("/:id?", getItems);
router.delete("/:id", deleteItem);

module.exports = router;
