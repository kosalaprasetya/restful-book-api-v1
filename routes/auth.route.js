const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: 'Ini dari endpoint auth!' });
});

module.exports = router;
