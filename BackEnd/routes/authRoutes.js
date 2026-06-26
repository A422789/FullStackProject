const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', protect, authorize('admin'), register);
//لازم يكون ادمن حتى يقدر يسجل يوزر جديد وانا هنا مررت الطلب للميدلوير
//الي تتحقق من التوكن والي بعده تتحقق من الرول
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
