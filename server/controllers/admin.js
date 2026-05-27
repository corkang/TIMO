const { getAdminDashboard } = require('../services/admin_dashboard');

exports.getDashboard = async (req, res, next) => {
  try {
    res.send(await getAdminDashboard());
  } catch (error) {
    next(error);
  }
};
