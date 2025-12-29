const notesModel = require("../models/notesModel");


const createNote = async (req, res) => {
  try {
    const { text, amount, direction, person, contextType, specialTitle } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 0,
        message: "Note text is required",
      });
    }

    const note = new notesModel({
      user: req.user.id,
      text,
      amount,
      direction,
      person,
      contextType: contextType || "general",
      specialTitle: contextType === "special" ? specialTitle : undefined,
    });

    if (contextType === "special" && !specialTitle) {
      return res.status(400).json({
        status: 0,
        message: "specialTitle is required for special notes",
      });
    }


    await note.save();

    res.status(201).json({
      status: 1,
      message: "Note added",
      data: note,
    });
  } catch {
    res.status(500).json({
      status: 0,
      message: "Failed to create note",
    });
  }
};


const getNotes = async (req, res) => {
  try {
    const { contextType, specialTitle } = req.query;

    const query = { user: req.user.id };

    if (contextType) query.contextType = contextType;
    if (specialTitle) query.specialTitle = specialTitle;

    const notes = await notesModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 1,
      data: notes,
    });
  } catch {
    res.status(500).json({
      status: 0,
      message: "Failed to fetch notes",
    });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await notesModel.deleteOne({
      _id: id,
      user: req.user.id,
    });

    if (!deleted.deletedCount) {
      return res.status(404).json({
        status: 0,
        message: "Note not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Note deleted",
    });
  } catch {
    res.status(500).json({
      status: 0,
      message: "Failed to delete note",
    });
  }
};

module.exports = { createNote, getNotes, deleteNote };

