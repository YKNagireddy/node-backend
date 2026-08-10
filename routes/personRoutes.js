const express = require('express');
const router = express.Router();
const uploadLogos = require('../middleware/upload');
const { createPerson, getAllPersons } = require('../controllers/personController');

router.post('/', uploadLogos, createPerson);
router.get('/', getAllPersons);

module.exports = router;
