
const Expense = require('../models/models.js')

// Insert Expense



const expenseInsert = async (req, res) => {
  try {
    const { amount, category, date, description, type, group } = req.body;

    const expense = new Expense({
      amount,
      category,
      description,
      type: type || "spent",
      group: group || "Personal",
      date,
      user: req.user.id,
    });

    const data = await expense.save();

    res.status(200).json({
      status: 1,
      message: "Expense added successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Error adding expense",
      error: err.message,
    });
  }
};


const expenseFilter = async (req, res) => {
  try {
    const { period, category, type, group } = req.query;
    const query = { user: req.user.id };

    // Filter by type (spent/received)
    if (type) query.type = type;

    // Filter by category
    if (category) query.category = category;

    // Filter by group
    if (group) query.group = group;

    // Filter by time period
    const now = new Date();
    if (period === "day") {
      query.date = {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lte: new Date(),
      };
    } else if (period === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - 7);
      query.date = { $gte: startOfWeek, $lte: new Date() };
    } else if (period === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query.date = { $gte: startOfMonth, $lte: new Date() };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // total summary
    const totalSpent = expenses
      .filter((e) => e.type === "spent")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalReceived = expenses
      .filter((e) => e.type === "received")
      .reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      status: 1,
      message: "Filtered Expenses",
      data: expenses,
      summary: {
        totalSpent,
        totalReceived,
        balance: totalReceived - totalSpent,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Error filtering expenses",
      error: err.message,
    });
  }
};


// Delete Expense
const expenseDelete = async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Ensure only the owner can delete
    const deleted = await Expense.deleteOne({ _id: expenseId, user: req.user.id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        status: 0,
        message: "Expense not found or unauthorized",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Expense deleted successfully",
      id: expenseId,
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Error deleting expense",
      error: err.message,
    });
  }
};

// View All Expenses for logged-in user
const expenseView = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    res.status(200).json({
      status: 1,
      message: "User Expenses",
      data: expenses,
    });
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "Error fetching expenses",
      error: err.message,
    });
  }
};

module.exports = { expenseInsert, expenseDelete, expenseView ,expenseFilter};
