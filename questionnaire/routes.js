const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('questionnaire.njk');
});

module.exports = router;
