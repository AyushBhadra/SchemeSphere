const express = require('express');
const { matchSchemes } = require('../controllers/filterController');

const router = express.Router();

router.post('/match', matchSchemes);

module.exports = router;
