const express = require('express');
const router = express.Router();
const { isValidJwtToken } = require('../middlewares/auth');

const authRouter = require('./auth');
const shareRouter = require('./share');
const adminRouter = require('./admin');
const userRouter = require('./user');
const timetableRouter = require('./timetable');
const reviewRouter = require('./review');
const searchController = require('../controllers/search');

router.use('/auth', authRouter);
router.use('/share', shareRouter);

router.use(isValidJwtToken);

router.get('/search', searchController.getSearchResults);
router.use('/admin', adminRouter);
router.use('/timetable', timetableRouter);
router.use('/user', userRouter);
router.use('/review', reviewRouter);

module.exports = router;
