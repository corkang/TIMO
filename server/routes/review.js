const { Router } = require('express');
const router = Router();
const reviewController = require('../controllers/review');

// 강의평 CRUD
router.post('/', reviewController.createReview);
router.get('/course', reviewController.getCourseReviews);
router.get('/my', reviewController.getMyReviews);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

// 좋아요
router.post('/:reviewId/like', reviewController.toggleLike);

// 과목 검색
router.get('/courses', reviewController.searchCourses);

module.exports = router;
