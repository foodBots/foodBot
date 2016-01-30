var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next){
  // console.log('in check user',  req.session);
  if (!isLoggedIn(req)) {
    console.log('checkUser fail', req.session);
    // res.redirect('foodBot/auth/signin');
  } else {
    // console.log('checkUser success', req.session);
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  // return req.session.regenerate(function() {
  //     req.session.user = newUser;
  //     console.log('created User', req.session);
  //     res.redirect('/');
  //   });
  req.session.user = newUser;
  // console.log('created session id', req.session.id);
};