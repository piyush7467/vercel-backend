const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    text: { type: String, required: true },

    amount: Number,

    direction: {
      type: String,
      enum: ["given", "taken"],
    },

    person: String,

    // 👇 ADD THESE
    contextType: {
      type: String,
      enum: ["general", "special"],
      default: "general",
    },

    specialTitle: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
