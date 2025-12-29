
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ExpenseSchema = new Schema(
//   {
//     amount: { type: Number, required: true },

//     category: { type: String, required: true },

//     description: { type: String, default: "" },

//     date: { type: Date, required: true },

//     type: {
//       type: String,
//       enum: ["spent", "received"],
//       default: "spent",
//     },

//     // 👇 EXISTING (keep it)
//     group: { type: String, default: "Personal" },

//     // 👇 NEW (VERY IMPORTANT)
//     contextType: {
//       type: String,
//       enum: ["general", "special"],
//       default: "general",
//     },

//     // 🔗 Only for special expenses
//     specialContext: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SpecialContext",
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// module.exports = mongoose.model("Expense", ExpenseSchema);





const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" }, // new field
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["spent", "received"],
      default: "spent" // spent -> red, received -> green
    },
    group: { type: String, default: "Personal" }, // e.g., Friends Trip, Family, Work
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);


