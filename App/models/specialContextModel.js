
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SpecialContextSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },
  description: String,

  type: {
    type: String,
    enum: ["trip", "event", "loan", "project", "custom"],
  },

  location: String,
  numberOfPersons: Number,

  startDate: Date,
  endDate: Date,
}, { timestamps: true });
module.exports = mongoose.model("SpecialContext", SpecialContextSchema);

