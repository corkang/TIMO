const { Op } = require('sequelize');
const CourseReview = require('../models/course_review');
const CourseReviewLike = require('../models/course_review_like');

// 통계 계산용 Score Map
const SCORE_MAP = {
  grading: { generous: 0, normal: 33, tight: 100 },
  difficulty: { easy: 0, low: 25, mid: 50, normal: 75, hard: 100 },
  assignments: { none: 0, normal: 50, heavy: 100 },
  teamProjects: { none: 0, normal: 50, heavy: 100 },
  quiz: { none: 0, normal: 50, hard: 100 },
};

// 퍼센트 분포 계산 헬퍼
const calculateDistribution = (reviews, field, options) => {
  const total = reviews.length;
  if (total === 0) return options.reduce((acc, opt) => ({ ...acc, [opt]: 0 }), {});

  const counts = reviews.reduce((acc, review) => {
    const value = review[field];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return options.reduce((acc, opt) => {
    acc[opt] = Math.round((counts[opt] || 0) * 100 / total);
    return acc;
  }, {});
};

// 강의평 작성
exports.createReview = async (req, res) => {
  const {
    courseName,
    courseCode,
    professor,
    semester,
    rating,
    grading,
    difficulty,
    exams,
    quiz,
    assignments,
    teamProjects,
    onlineOfflineRatio,
    teachingMethod,
    comment,
  } = req.body;

  // 유효성 검사
  if (!courseName || !professor || !semester || !rating || !comment) {
    return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  }

  if (comment.length < 10 || comment.length > 500) {
    return res.status(400).json({ error: '코멘트는 10자 이상 500자 이하여야 합니다.' });
  }

  const review = await CourseReview.create({
    userId: req.user.id,
    courseName,
    courseCode,
    professor,
    semester,
    rating,
    grading,
    difficulty,
    exams,
    quiz,
    assignments,
    teamProjects,
    onlineOfflineRatio,
    teachingMethod,
    comment,
  });

  res.json({ success: true, reviewId: review.id });
};

// 특정 과목의 강의평 목록 + 통계
exports.getCourseReviews = async (req, res) => {
  const { name, professor, sort = 'latest' } = req.query;

  if (!name || !professor) {
    return res.status(400).json({ error: '과목명과 교수명이 필요합니다.' });
  }

  // 정렬 옵션
  let order;
  switch (sort) {
    case 'likes':
      order = [['likeCount', 'DESC'], ['createdAt', 'DESC']];
      break;
    case 'rating':
      order = [['rating', 'DESC'], ['createdAt', 'DESC']];
      break;
    default:
      order = [['createdAt', 'DESC']];
  }

  const reviews = await CourseReview.findAll({
    where: { courseName: name, professor },
    order,
  });

  // 현재 유저가 좋아요 누른 리뷰 ID 목록
  const userLikes = await CourseReviewLike.findAll({
    where: {
      userId: req.user.id,
      reviewId: reviews.map((r) => r.id),
    },
  });
  const likedReviewIds = new Set(userLikes.map((l) => l.reviewId));

  // 통계 계산
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount * 10) / 10
    : 0;

  const stats = {
    avgRating,
    grading: calculateDistribution(reviews, 'grading', ['generous', 'normal', 'tight', 'survival']),
    difficulty: calculateDistribution(reviews, 'difficulty', ['easy', 'low', 'mid', 'normal', 'hard']),
    exams: calculateDistribution(reviews, 'exams', ['none', 'normal', 'hard']),
    quiz: calculateDistribution(reviews, 'quiz', ['none', 'normal', 'hard']),
    assignments: calculateDistribution(reviews, 'assignments', ['none', 'normal', 'heavy']),
    teamProjects: calculateDistribution(reviews, 'teamProjects', ['none', 'normal', 'heavy']),
    onlineOfflineRatio: calculateDistribution(reviews, 'onlineOfflineRatio', ['offline', 'half', 'online']),
    teachingMethod: calculateDistribution(reviews, 'teachingMethod', ['theory', 'discussion', 'project']),
  };

  // 응답 데이터 가공
  const reviewsData = reviews.map((r) => ({
    id: r.id,
    userId: r.userId,
    semester: r.semester,
    rating: r.rating,
    grading: r.grading,
    difficulty: r.difficulty,
    exams: r.exams,
    quiz: r.quiz,
    assignments: r.assignments,
    teamProjects: r.teamProjects,
    onlineOfflineRatio: r.onlineOfflineRatio,
    teachingMethod: r.teachingMethod,
    comment: r.comment,
    likeCount: r.likeCount,
    isLikedByMe: likedReviewIds.has(r.id),
    isMyReview: r.userId === req.user.id,
    createdAt: r.createdAt,
  }));

  res.json({
    courseInfo: {
      courseName: name,
      professor,
      reviewCount,
    },
    stats,
    reviews: reviewsData,
  });
};

// 내가 작성한 강의평 목록
exports.getMyReviews = async (req, res) => {
  const reviews = await CourseReview.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });

  res.json({ reviews });
};

// 강의평 수정
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const review = await CourseReview.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({ error: '강의평을 찾을 수 없습니다.' });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ error: '본인의 강의평만 수정할 수 있습니다.' });
  }

  const {
    semester,
    rating,
    grading,
    difficulty,
    exams,
    quiz,
    assignments,
    teamProjects,
    onlineOfflineRatio,
    teachingMethod,
    comment,
  } = req.body;

  if (comment && (comment.length < 10 || comment.length > 500)) {
    return res.status(400).json({ error: '코멘트는 10자 이상 500자 이하여야 합니다.' });
  }

  await review.update({
    semester: semester || review.semester,
    rating: rating || review.rating,
    grading: grading || review.grading,
    difficulty: difficulty || review.difficulty,
    exams: exams || review.exams,
    quiz: quiz || review.quiz,
    assignments: assignments || review.assignments,
    teamProjects: teamProjects || review.teamProjects,
    onlineOfflineRatio: onlineOfflineRatio || review.onlineOfflineRatio,
    teachingMethod: teachingMethod || review.teachingMethod,
    comment: comment || review.comment,
  });

  res.json({ success: true });
};

// 강의평 삭제
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const review = await CourseReview.findByPk(reviewId);

  if (!review) {
    return res.status(404).json({ error: '강의평을 찾을 수 없습니다.' });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ error: '본인의 강의평만 삭제할 수 있습니다.' });
  }

  // 관련 좋아요도 삭제
  await CourseReviewLike.destroy({ where: { reviewId } });
  await review.destroy();

  res.json({ success: true });
};

// 좋아요 토글
exports.toggleLike = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  const review = await CourseReview.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({ error: '강의평을 찾을 수 없습니다.' });
  }

  const existingLike = await CourseReviewLike.findOne({
    where: { reviewId, userId },
  });

  let liked;
  if (existingLike) {
    // 좋아요 취소
    await existingLike.destroy();
    await review.update({ likeCount: Math.max(0, review.likeCount - 1) });
    liked = false;
  } else {
    // 좋아요 추가
    await CourseReviewLike.create({ reviewId, userId });
    await review.update({ likeCount: review.likeCount + 1 });
    liked = true;
  }

  res.json({ liked, likeCount: review.likeCount });
};

// 강의평이 있는 과목 목록 (검색)
exports.searchCourses = async (req, res) => {
  const { search = '' } = req.query;

  const whereClause = search
    ? {
      [Op.or]: [
        { courseName: { [Op.like]: `%${search}%` } },
        { professor: { [Op.like]: `%${search}%` } },
        { courseCode: { [Op.like]: `%${search}%` } },
      ],
    }
    : {};

  // 과목명 + 교수명으로 그룹핑하여 중복 제거
  const reviews = await CourseReview.findAll({
    where: whereClause,
    attributes: [
      'courseName',
      'courseCode',
      'professor',
      [CourseReview.sequelize.fn('COUNT', CourseReview.sequelize.col('id')), 'reviewCount'],
      [CourseReview.sequelize.fn('AVG', CourseReview.sequelize.col('rating')), 'avgRating'],
    ],
    group: ['courseName', 'professor', 'courseCode'],
    order: [[CourseReview.sequelize.literal('reviewCount'), 'DESC']],
    limit: 50,
  });

  const courses = reviews.map((r) => ({
    courseName: r.courseName,
    courseCode: r.courseCode,
    professor: r.professor,
    reviewCount: parseInt(r.getDataValue('reviewCount'), 10),
    avgRating: Math.round(parseFloat(r.getDataValue('avgRating')) * 10) / 10,
  }));

  res.json({ courses });
};
