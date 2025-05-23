const router = require('express').Router();
const Books = require('../controllers/books.controller');

router.get('/', Books.getAllBooks);

router.get('/:id', Books.getBookById);

router.post('/', Books.addBook);

router.delete('/:id', Books.deleteBook);

router.put('/:id', Books.updateBook);

module.exports = router;
