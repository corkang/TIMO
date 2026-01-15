const Lecture = require('../models/lecture');
const Search = require('../models/search');
const Timetable = require('../models/timetable');
const UserLectureGleaningRelation = require('../models/user_lecture_gleaning_relation');
const UserLectureRelation = require('../models/user_lecture_relation');
const CourseReview = require('../models/course_review');
const { searchWhereClause } = require('../utils/query_helper');
const { sequelize } = require('../models');

exports.getSearchResults = async (req, res) => {
  const { search, page } = req.query;
  const limit = req.query.limit ? +req.query.limit : (+process.env.PAGE_LIMIT || 20);
  const decodedSearch = decodeURIComponent(search);

  Search.create({ userId: req.user.id, search: decodedSearch });

  const queryOptions = {
    where: searchWhereClause(decodedSearch),
    limit,
    offset: page ? limit * (+page - 1) : 0,
  };

  if (req.query.groupBy === 'true') {
    queryOptions.group = ['name', 'professor'];
    queryOptions.attributes = [
      'name',
      'professor',
      [sequelize.fn('MIN', sequelize.col('id')), 'id'],
      [sequelize.fn('MIN', sequelize.col('code')), 'code'], // Get one code (e.g. section 01)
      [sequelize.fn('MAX', sequelize.col('credit')), 'credit'],
      [sequelize.fn('MAX', sequelize.col('period')), 'period'],
      [sequelize.fn('MAX', sequelize.col('gubun')), 'gubun'], // Needed for other parts? maybe not for review page but safe to have
    ];
  }

  const { count, rows: lectures } = await Lecture.findAndCountAll(queryOptions);

  // findAndCountAll with group returns count as an array of objects
  const totalCount = req.query.groupBy === 'true' ? count.length : count;

  // Get spike information
  const lecturesWithCount = await Promise.all(
    lectures.map(async (lec) => {
      const promises = [
        // Add
        Timetable.count({
          include: {
            model: Lecture,
            where: {
              id: lec.id,
            },
          },
          distinct: true,
          col: 'userId',
        }),
        // Bookmark
        UserLectureRelation.count({
          where: { lectureId: lec.id },
        }),
        // Spike
        UserLectureGleaningRelation.count({
          where: { lectureId: lec.id },
        }),
        // Always fetch review stats
        CourseReview.findOne({
          where: {
            courseName: lec.name,
            professor: lec.professor,
          },
          attributes: [
            [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount'],
          ],
          raw: true,
        }),
      ];

      const results = await Promise.all(promises);
      const [add, bookmark, spike, reviewStatsRaw] = results;

      const reviewStats = reviewStatsRaw ? {
        avgRating: parseFloat(reviewStatsRaw.avgRating || 0),
        reviewCount: parseInt(reviewStatsRaw.reviewCount || 0, 10),
      } : null; // Default to null if no review stats found

      return {
        ...lec.dataValues,
        count: {
          add,
          bookmark,
          spike,
        },
        reviewStats,
      };
    }),
  );

  // console.log(`[DEBUG] Final lectures count: ${lecturesWithCount.length}, Sample:`, lecturesWithCount[0]);
  res.send({ pages: totalCount === 0 ? 0 : Math.ceil(totalCount / limit), lectures: lecturesWithCount });
};
