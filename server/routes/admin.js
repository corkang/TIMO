const { Router } = require('express');
const adminController = require('../controllers/admin');
const { isAdmin } = require('../middlewares/admin');

const router = Router();

router.get('/dashboard', isAdmin, adminController.getDashboard);

module.exports = router;
