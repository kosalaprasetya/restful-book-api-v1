const router = require('express').Router();
const authController = require('../controllers/authentication.controller.js');

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Authentication endpoint' });
});

router.post('/login', authController.Login);
router.post('/register', authController.Register);

module.exports = router;
