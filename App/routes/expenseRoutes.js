const express = require("express");
const { expenseInsert, expenseDelete, expenseView, expenseFilter } = require("../controller/expanseController.js");
const authMiddleware = require("../middleware/auth.js");


const expenseRouter = express.Router();

expenseRouter.post("/insert",authMiddleware, expenseInsert);
expenseRouter.delete("/delete/:id",authMiddleware, expenseDelete);
expenseRouter.get("/view",authMiddleware, expenseView);
expenseRouter.get("/filter",authMiddleware, expenseFilter);

module.exports = expenseRouter;
