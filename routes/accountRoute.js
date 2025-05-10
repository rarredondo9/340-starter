const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');


router.get('/login', accountController.getLoginView);

router.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = router;