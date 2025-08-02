const Group = require("../models/Group");
const Program = require("../models/Program");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const [totalGroups, totalUsers] = await Promise.all([
      Group.countDocuments(),
      User.countDocuments(),
    ]);

    const programs = await Program.find();

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    let totalPrograms = programs.length;
    let upcoming = 0;
    let inProgress = 0;
    let completed = 0;

    let totalEstimate = 0;
    let totalCost = 0;

    for (const program of programs) {
      totalEstimate += program.costIdea || 0;
      totalCost += program.fixedCost || 0;

      //   if (program.fixedCost > 0) {
      //     completed++;
      //   } else if (program.programDate > endOfToday) {
      //     upcoming++;
      //   } else if (
      //     program.programDate >= startOfToday &&
      //     program.programDate <= endOfToday
      //   ) {
      //     inProgress++;
      //   }
      if (program.fixedCost > 0 && program.programDate < startOfToday) {
        completed++;
      } else if (
        program.fixedCost === 0 &&
        program.programDate <= endOfToday &&
        program.programDate <= now
      ) {
        inProgress++;
      } else if (
        program.fixedCost > 0 &&
        program.programDate >= startOfToday &&
        program.programDate <= now
      ) {
        inProgress++;
      } else if (program.programDate > endOfToday) {
        upcoming++;
      }
    }

    const costDistance = totalEstimate - totalCost;

    res.status(200).json({
      totalGroups,
      totalUsers,
      totalPrograms,
      upcomingPrograms: upcoming,
      inProgressPrograms: inProgress,
      completedPrograms: completed,
      totalEstimatedCost: totalEstimate,
      totalActualCost: totalCost,
      costDistance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// optional api
const getDashboardStatsDetailed = async (req, res) => {
  try {
    const groups = await Group.find().lean();
    const users = await User.find().select("-password").lean();
    const programs = await Program.find()
      .populate("attendees", "name email role photo")
      .lean();

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    let totalPrograms = programs.length;
    let totalEstimate = 0;
    let totalCost = 0;

    let upcoming = 0,
      inProgress = 0,
      completed = 0;

    // Build group-wise structure
    const groupMap = {};
    for (const group of groups) {
      groupMap[group._id.toString()] = {
        _id: group._id,
        name: group.name,
        location: group.location,
        users: [],
        programs: [],
      };
    }

    // Assign users to groups
    for (const user of users) {
      if (Array.isArray(user.groupId)) {
        user.groupId.forEach((gid) => {
          const gidStr = gid?.toString();
          if (groupMap[gidStr]) {
            groupMap[gidStr].users.push({
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              photo: user.photo,
              role: user.role,
              status: user.status,
            });
          }
        });
      }
    }

    // Assign programs to groups
    for (const program of programs) {
      const groupId = program.groupId?.toString();
      if (!groupMap[groupId]) continue;

      totalEstimate += program.costIdea || 0;
      totalCost += program.fixedCost || 0;

      let status = "";
      if (program.fixedCost > 0) {
        completed++;
        status = "completed";
      } else if (program.programDate > endOfToday) {
        upcoming++;
        status = "upcoming";
      } else if (
        program.programDate >= startOfToday &&
        program.programDate <= endOfToday
      ) {
        inProgress++;
        status = "in-progress";
      }

      groupMap[groupId].programs.push({
        _id: program._id,
        name: program.name,
        programDate: program.programDate,
        costIdea: program.costIdea,
        fixedCost: program.fixedCost,
        status,
        attendees: program.attendees,
      });
    }

    const groupList = Object.values(groupMap);
    const totalGroups = groupList.length;
    const totalUsers = users.length;

    res.status(200).json({
      totalGroups,
      totalUsers,
      totalPrograms,
      upcomingPrograms: upcoming,
      inProgressPrograms: inProgress,
      completedPrograms: completed,
      totalEstimatedCost: totalEstimate,
      totalActualCost: totalCost,
      costDistance: totalEstimate - totalCost,
      groups: groupList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getDashboardHighlights = async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 }).lean();
    const users = await User.find().select("-password").lean();
    const programs = await Program.find()
      .populate("attendees", "name email role")
      .sort({ programDate: -1 })
      .lean();

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    // Filter recent groups/programs
    const recentGroups = groups.slice(0, 5);
    const recentPrograms = programs.slice(0, 5);

    // Top groups by number of programs
    const groupProgramCount = {};
    for (const program of programs) {
      const gid = program.groupId?.toString();
      if (!gid) continue;
      groupProgramCount[gid] = (groupProgramCount[gid] || 0) + 1;
    }
    const topGroups = Object.entries(groupProgramCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([groupId, count]) => {
        const group = groups.find((g) => g._id.toString() === groupId);
        return group ? { ...group, totalPrograms: count } : null;
      })
      .filter(Boolean);

    // Top programs by number of attendees
    const topPrograms = [...programs]
      .sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0))
      .slice(0, 5)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        programDate: p.programDate,
        attendeeCount: p.attendees?.length || 0,
        groupId: p.groupId,
      }));

    // Filter by status
    const inProgressPrograms = programs.filter(
      (p) =>
        p.programDate >= startOfToday &&
        p.programDate <= endOfToday &&
        !p.fixedCost
    );

    const completedPrograms = programs.filter((p) => p.fixedCost > 0);
    const upcomingPrograms = programs.filter((p) => p.programDate > endOfToday);

    const pendingUsers = users.filter((u) => u.status === "pending");
    const activeUsers = users.filter((u) => u.status === "active");

    res.status(200).json({
      recentGroups,
      recentPrograms,
      topGroups,
      topPrograms,
      inProgressPrograms,
      completedPrograms,
      upcomingPrograms,
      pendingUsers,
      activeUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardStatsDetailed,
  getDashboardHighlights,
};
