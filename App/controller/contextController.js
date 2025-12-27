
const Expense = require("../models/models.js"); 
const notesModel = require("../models/notesModel.js");

const createYear = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year || isNaN(year)) {
      return res.status(400).json({
        status: 0,
        message: "Valid year is required",
      });
    }

    res.status(201).json({
      status: 1,
      message: "Year context created",
      data: { year: Number(year) },
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Failed to create year",
    });
  }
};


const getYears = async (req, res) => {
  try {
    const years = await Expense.distinct("year", {
      user: req.user.id,
      contextType: "general",
    });

    res.status(200).json({
      status: 1,
      data: years.sort((a, b) => b - a),
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Error fetching years",
    });
  }
};


const createMonth = async (req, res) => {
  try {
    const { year, month, description } = req.body;

    if (!year || !month) {
      return res.status(400).json({
        status: 0,
        message: "Year and month are required",
      });
    }

    res.status(201).json({
      status: 1,
      message: "Month context created",
      data: {
        year: Number(year),
        month,
        description: description || "",
      },
    });
  } catch {
    res.status(500).json({
      status: 0,
      message: "Failed to create month",
    });
  }
};


const getMonthsByYear = async (req, res) => {
  try {
    const { year } = req.params;

    const months = await Expense.distinct("month", {
      user: req.user.id,
      year: Number(year),
      contextType: "general",
    });

    res.status(200).json({
      status: 1,
      data: months,
    });
  } catch {
    res.status(500).json({ status: 0 });
  }
};

const createWeek = async (req, res) => {
  try {
    const { year, month, week } = req.body;

    if (!year || !month || !week) {
      return res.status(400).json({
        status: 0,
        message: "Year, month and week are required",
      });
    }

    res.status(201).json({
      status: 1,
      message: "Week context created",
      data: {
        year: Number(year),
        month,
        week,
      },
    });
  } catch {
    res.status(500).json({
      status: 0,
      message: "Failed to create week",
    });
  }
};


const getWeeks = async (req, res) => {
  try {
    const { year, month } = req.params;

    const weeks = await Expense.distinct("week", {
      user: req.user.id,
      year: Number(year),
      month,
      contextType: "general",
      week: { $ne: null },
    });

    res.status(200).json({
      status: 1,
      data: weeks,
    });
  } catch {
    res.status(500).json({ status: 0 });
  }
};



const createSpecialContext = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        status: 0,
        message: "Special title is required",
      });
    }

    res.status(201).json({
      status: 1,
      message: "Special context created",
      data: {
        title,
        description,
      },
    });
  } catch {
    res.status(500).json({ status: 0 });
  }
};


const getSpecialContexts = async (req, res) => {
  try {
    const specials = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          contextType: "special",
        },
      },
      {
        $group: {
          _id: "$specialTitle",
          description: { $first: "$specialDescription" },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: 1,
      data: specials.map((s) => ({
        title: s._id,
        description: s.description,
        totalAmount: s.totalAmount,
        transactions: s.count,
      })),
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Failed to fetch special contexts",
    });
  }
};




const deleteSpecialContext = async (req, res) => {
  try {
    const { title } = req.params;

    // delete expenses
    const expenseResult = await Expense.deleteMany({
      user: req.user.id,
      contextType: "special",
      specialTitle: title,
    });

    // delete notes
    const noteResult = await notesModel.deleteMany({
      user: req.user.id,
      contextType: "special",
      specialTitle: title,
    });

    res.status(200).json({
      status: 1,
      message: "Special context deleted",
      deletedExpenses: expenseResult.deletedCount,
      deletedNotes: noteResult.deletedCount,
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Failed to delete special context",
    });
  }
};


module.exports = { getYears, getMonthsByYear, getWeeks, createSpecialContext, createYear, createMonth, createWeek, getSpecialContexts, deleteSpecialContext };

