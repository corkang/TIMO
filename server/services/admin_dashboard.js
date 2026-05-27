const { Sequelize } = require('../models');
const Feedback = require('../models/feedback');
const Search = require('../models/search');
const User = require('../models/user');

const { Op } = Sequelize;

const LIMITS = {
  feedback: 50,
  searches: 20,
  users: 100,
};

const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

const countRecentActiveUsers = async () => {
  const [last24Hours, last3Days, last7Days] = await Promise.all([
    User.count({ where: { lastLoggedInAt: { [Op.gte]: hoursAgo(24) } } }),
    User.count({ where: { lastLoggedInAt: { [Op.gte]: hoursAgo(72) } } }),
    User.count({ where: { lastLoggedInAt: { [Op.gte]: hoursAgo(168) } } }),
  ]);

  return {
    last24Hours,
    last3Days,
    last7Days,
  };
};

const getFeedbackRows = async () => {
  const hasCreatedAt = Boolean(Feedback.rawAttributes && Feedback.rawAttributes.createdAt);
  const feedbackRows = await Feedback.findAll({
    attributes: hasCreatedAt ? ['id', 'userId', 'feedback', 'createdAt'] : ['id', 'userId', 'feedback'],
    order: [[hasCreatedAt ? 'createdAt' : 'id', 'DESC']],
    limit: LIMITS.feedback,
    raw: true,
  });

  const userIds = [...new Set(feedbackRows.map(({ userId }) => userId).filter(Boolean))];
  const users =
    userIds.length === 0
      ? []
      : await User.findAll({
          attributes: ['id', 'email'],
          where: { id: userIds },
          raw: true,
        });
  const emailByUserId = users.reduce((result, user) => {
    result[user.id] = user.email;
    return result;
  }, {});

  return feedbackRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    email: emailByUserId[row.userId] || null,
    feedback: row.feedback,
    createdAt: row.createdAt || null,
  }));
};

const getTopSearchTerms = async () =>
  Search.findAll({
    attributes: ['search', [Sequelize.fn('COUNT', Sequelize.col('search')), 'count']],
    where: {
      search: {
        [Op.ne]: '',
      },
    },
    group: ['search'],
    order: [[Sequelize.literal('count'), 'DESC']],
    limit: LIMITS.searches,
    raw: true,
  });

const getUserRows = async () =>
  User.findAll({
    attributes: ['id', 'email', 'lastLoggedInAt', 'viewCount'],
    order: [['lastLoggedInAt', 'DESC']],
    limit: LIMITS.users,
    raw: true,
  });

const getAdminDashboard = async () => {
  const [totalUsers, recentActive, feedbackItems, topTerms, userItems] = await Promise.all([
    User.count(),
    countRecentActiveUsers(),
    getFeedbackRows(),
    getTopSearchTerms(),
    getUserRows(),
  ]);

  return {
    users: {
      total: totalUsers,
      recentActive,
      items: userItems.map((user) => ({
        id: user.id,
        email: user.email,
        lastLoggedInAt: user.lastLoggedInAt,
        viewCount: user.viewCount,
      })),
    },
    feedback: {
      items: feedbackItems,
    },
    searches: {
      topTerms: topTerms.map((term) => ({
        search: term.search,
        count: Number(term.count),
      })),
    },
    notes: [
      'Recent active users are based on the latest lastLoggedInAt/authenticated app activity timestamp.',
    ],
  };
};

module.exports = {
  getAdminDashboard,
};
