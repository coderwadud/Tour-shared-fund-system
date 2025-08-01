const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { updateUserStatus, listUsers, getSingleUser, deleteUser, updateUserProfile } = require('../controllers/userController');


router.get('/', protect, checkRole(['admin', 'super-admin']), listUsers);
router.get('/:id', protect, checkRole(['admin', 'super-admin']), getSingleUser);
router.put('/:id',  updateUserProfile);
router.put('/:id/status', protect, checkRole(['admin', 'super-admin']), updateUserStatus);
router.delete('/:id', protect, checkRole(['admin', 'super-admin']), deleteUser);

module.exports = router;