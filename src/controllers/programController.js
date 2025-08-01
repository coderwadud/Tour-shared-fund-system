const Program = require("../models/Program");
const Group = require("../models/Group");
const User = require("../models/User");
// Create a new program
const createProgram = async (req, res) => {
  try {
    const {
      name,
      location,
      photo,
      costIdea,
      fixedCost,
      programDate,
      groupId,
    } = req.body;

    const newProgram = new Program({
      name,
      location,
      photo,
      costIdea,
      fixedCost,
      programDate,
      groupId,
      createdBy: req.user.id,
    });
    const savedProgram = await newProgram.save();
    res.status(201).json(savedProgram);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all programs (optionally filter by group)
const getAllPrograms = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const query = groupId ? { groupId } : {};

    const programs = await Program.find(query)
      .populate("groupId")
      .populate("createdBy");
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single program with attendees
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate("attendees")
      .populate("groupId")
      .populate("createdBy");
    if (!program) return res.status(404).json({ error: "Program not found" });

    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const markGroupAttendance = async (req, res) => {
  try {
    const programId = req.params.id;
    const { userIds } = req.body;

    const program = await Program.findById(programId);
    if (!program) return res.status(404).json({ error: "Program not found" });

    // Get all users in this group
    const groupUsers = await User.find({ groupId: program.groupId }).select('_id');

    const validUserIds = groupUsers
      .map(user => user._id.toString())
      .filter(id => userIds.includes(id));

    const newAttendees = validUserIds.filter(
      id => !program.attendees.map(uid => uid.toString()).includes(id)
    );

    program.attendees.push(...newAttendees);
    await program.save();

    res.json({
      message: "Group attendance recorded",
      attendees: program.attendees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProgram = async (req, res) => {
  const { id } = req.params; // programId
  const updates = req.body;

  try {
    const updatedProgram = await Program.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('groupId')
      .populate('createdBy')
      .populate('attendees');

    if (!updatedProgram) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json({ message: "Program updated", program: updatedProgram });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createProgram,
  getAllPrograms,
  getProgramById,
  markGroupAttendance,
  updateProgram
};
