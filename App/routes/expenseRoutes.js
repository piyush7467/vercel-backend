const express = require("express");
const { expenseInsert, expenseDelete, expenseView, expenseFilter } = require("../controller/expanseController.js");
const authMiddleware = require("../middleware/auth.js");
const { getYears, getMonthsByYear, getWeeks, createSpecialContext, createYear, createMonth, createWeek, getSpecialContexts, deleteSpecialContext } = require("../controller/contextController.js");
const { createNote, getNotes, deleteNote } = require("../controller/noteController.js");


const expenseRouter = express.Router();


expenseRouter.post("/year", authMiddleware, createYear);
expenseRouter.post("/month", authMiddleware, createMonth);
expenseRouter.post("/week", authMiddleware, createWeek);

expenseRouter.get("/years", authMiddleware, getYears);
expenseRouter.get("/months/:year", authMiddleware, getMonthsByYear);
expenseRouter.get("/weeks/:year/:month", authMiddleware, getWeeks);

expenseRouter.post("/special", authMiddleware, createSpecialContext);
expenseRouter.get("/special", authMiddleware, getSpecialContexts);
expenseRouter.delete("/special/:title", authMiddleware, deleteSpecialContext);

expenseRouter.post("/notes", authMiddleware, createNote);
expenseRouter.get("/notes", authMiddleware, getNotes);
expenseRouter.delete("/notes/:id", authMiddleware, deleteNote);

expenseRouter.post("/insert", authMiddleware, expenseInsert);
expenseRouter.delete("/delete/:id", authMiddleware, expenseDelete);
expenseRouter.get("/view", authMiddleware, expenseView);
expenseRouter.get("/filter", authMiddleware, expenseFilter);



module.exports = expenseRouter;
