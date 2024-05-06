const router = require('express').Router();
const jamaatController = require('../controllers/jamaatController');

router.get('/getjamaats', jamaatController.getAllJamaats);

module.exports = router;
