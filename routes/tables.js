const express = require("express");
const router = express.Router();
const {
  addTable,
  updateTable,
  getTables,
  deleteTable,
} = require("../controllers/tablesController.js");

router.post("/", addTable);
router.put("/:id", updateTable);
router.get("/:id?", getTables);
router.delete("/:id", deleteTable);

module.exports = router;
