var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next){
  console.log('in check user',  req.session);
  if (!req.isAuthenticated()) {
    console.log('not authenticataed');
    res.redirect('/foodBot/auth/logout');
  } else {
    // console.log('checkUser success', req.session);
    return next();
    // next();
  }
};

exports.createSession = function(req, res, newUser) {
  req.session.user = newUser;
  console.log('Auth.createSession', req.session, newUser);
};
