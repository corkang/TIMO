const parseAdminEmails = (rawEmails = '') =>
  rawEmails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const isAdminEmail = (email, rawEmails = process.env.ADMIN_EMAILS || '') => {
  if (!email) return false;
  return parseAdminEmails(rawEmails).includes(email.trim().toLowerCase());
};

const isAdmin = (req, res, next) => {
  if (!isAdminEmail(req.user && req.user.email)) {
    res.status(403).send({ message: 'Admin access required.' });
    return;
  }

  next();
};

module.exports = {
  isAdmin,
  isAdminEmail,
  parseAdminEmails,
};
