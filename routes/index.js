const router = require('express').Router();
const authentication = require('../middlewares/authentication.js');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'see API documentation for more information!' });
});

router.use('/auth', require('./auth.route.js'));
router.use('/books', authentication, require('./books.route.js'));

module.exports = router;
