const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'see API documentation for more information!' });
});

router.use('/auth', require('./auth.route.js'));

module.exports = router;
