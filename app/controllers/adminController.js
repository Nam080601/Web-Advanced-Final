const userModel = require('../models/user.model');

class AdminController {
  index(req, res, next) {
    userModel.find({})
      .then((user) => {
        console.log(user);
        res.render('admin', {title: 'Admin', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  detail(req, res, next) {
    res.render('user-detail', {title: 'Detail'});
  }
}

module.exports = new AdminController;