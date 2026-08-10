const express = require('express');
const router = express.Router();
const uploadLogos = require('../middleware/upload');
const { createPerson, getAllPersons, seedPerson } = require('../controllers/personController');

router.post('/', uploadLogos, createPerson);
router.get('/', getAllPersons);
router.post("/seed", seedPerson);

module.exports = router;
