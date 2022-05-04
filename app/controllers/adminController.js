const User = require('../models/user');

class AdminController {
  index(req, res, next) {
    User.find({})
      .then((user) => {
        res.render('admin', {title: 'Admin', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  profile(req, res, next) {
    res.render('profile', {title: 'Profile'});
  }
}

module.exports = new AdminController;