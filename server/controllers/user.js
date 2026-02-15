const Feedback = require('../models/feedback');
const Lecture = require('../models/lecture');
const Timetable = require('../models/timetable');
const User = require('../models/user');
const UserLectureRelation = require('../models/user_lecture_relation');
const UserLectureGleaningRelation = require('../models/user_lecture_gleaning_relation');
const CourseReview = require('../models/course_review');

async function syncLectureWaitingStatus(lectureId) {
  const waitingCount = await UserLectureGleaningRelation.count({
    where: { lectureId },
  });
  await Lecture.update(
    {
      waitingNum: waitingCount,
      hasWaitingUser: waitingCount > 0,
    },
    { where: { id: lectureId } },
  );
}

exports.getUser = async (req, res) => {
  await User.update(
    {
      viewCount: User.sequelize.literal('viewCount + 1'),
      lastLoggedInAt: new Date(),
    },
    { where: { id: req.user.id } },
  );

  const user = await User.findOne({
    where: { id: req.user.id },
    include: [
      { as: 'bookmarks', model: Lecture },
      { as: 'spikes', model: Lecture },
      { model: Timetable, include: Lecture },
    ],
  });

  let userData = user.toJSON();

  // Helper to fetch and attach review stats
  const attachReviewStats = async (lectures) => {
    if (!lectures) return [];
    return Promise.all(
      lectures.map(async (lec) => {
        const reviewStatsRaw = await CourseReview.findOne({
          where: {
            courseName: lec.name,
            professor: lec.professor,
          },
          attributes: [
            [User.sequelize.fn('AVG', User.sequelize.col('rating')), 'avgRating'],
            [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'reviewCount'],
          ],
          raw: true,
        });

        const reviewStats = reviewStatsRaw
          ? {
            avgRating: parseFloat(reviewStatsRaw.avgRating || 0),
            reviewCount: parseInt(reviewStatsRaw.reviewCount || 0, 10),
          }
          : null;

        return { ...lec, reviewStats };
      })
    );
  };

  // Attach stats to bookmarks
  if (userData.bookmarks) {
    userData.bookmarks = await attachReviewStats(userData.bookmarks);
  }

  // Attach stats to spikes
  if (userData.spikes) {
    userData.spikes = await attachReviewStats(userData.spikes);
  }

  // Attach stats to timetable lectures
  if (userData.timetables) {
    userData.timetables = await Promise.all(
      userData.timetables.map(async (timetable) => {
        if (timetable.lectures) {
          timetable.lectures = await attachReviewStats(timetable.lectures);
        }
        return timetable;
      })
    );
  }

  res.send(userData);
};

exports.bookmarkLecture = async (req, res) => {
  await UserLectureRelation.create({
    userId: req.user.id,
    lectureId: +req.params.lectureId,
  });
  res.send('complete');
};

exports.unbookmarkLecture = async (req, res) => {
  await UserLectureRelation.destroy({
    where: {
      userId: req.user.id,
      lectureId: +req.params.lectureId,
    },
  });
  res.send('complete');
};

exports.addSpikeLecture = async (req, res) => {
  const lectureId = +req.params.lectureId;
  await UserLectureGleaningRelation.create({
    userId: req.user.id,
    lectureId,
  });
  await syncLectureWaitingStatus(lectureId);
  res.send('complete');
};

exports.deleteSpikeLecture = async (req, res) => {
  const lectureId = +req.params.lectureId;
  await UserLectureGleaningRelation.destroy({
    where: {
      userId: req.user.id,
      lectureId,
    },
  });
  await syncLectureWaitingStatus(lectureId);
  res.send('complete');
};

exports.getBookmarks = async (req, res) => {
  const userBookmarks = await User.findOne({
    where: { id: req.user.id },
    include: {
      model: Lecture,
      through: UserLectureRelation,
    },
  });

  res.send(userBookmarks.lectures);
};

exports.createFeedback = async (req, res) => {
  await Feedback.create({
    userId: req.user.id,
    feedback: req.body.feedback,
  });

  res.send('complete');
};
