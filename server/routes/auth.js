const { Router } = require('express');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const router = Router();

const { isValidJwtToken } = require('../middlewares/auth');

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth', session: false }),
  function (req, res) {
    const accessToken = JWT.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    
    // Cross-domain 쿠키 문제 해결: URL 파라미터로 토큰 전달
    const redirectUrl = new URL(process.env.GOOGLE_REDIRECT_URL);
    redirectUrl.searchParams.set('token', accessToken);
    
    res.redirect(redirectUrl.toString());
  },
);

router.get('/', isValidJwtToken, function (req, res) {
  res.send({ authenticated: req.user !== undefined });
});

module.exports = router;
