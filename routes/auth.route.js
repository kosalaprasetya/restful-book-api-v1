const router = require('express').Router();
const authController = require('../controllers/authentication.controller.js');

router.get('/', (req, res) => {
  res.json({ message: 'This is auth endpoint, go to /login or /register' });
});

router.post('/login', authController.Login);
router.post('/register', authController.Register);

module.exports = router;
