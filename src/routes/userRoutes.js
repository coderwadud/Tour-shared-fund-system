const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { updateUserStatus, listUsers } = require('../controllers/userController');

// Only super-admin or admin can update user status
router.put('/:id/status', protect, checkRole(['admin', 'super-admin']), updateUserStatus);

// View all users (admin panel)
router.get('/', protect, checkRole(['admin', 'super-admin']), listUsers);

module.exports = router;
