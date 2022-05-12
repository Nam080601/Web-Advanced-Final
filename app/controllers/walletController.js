const User = require('../models/user');

class WalletController {
  index(req, res, next) {
    User.find({})
      .then((user) => {
        res.render('wallet', {title: 'Wallet', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  recharge(req, res, next) {
    User.find({})
      .then((user) => {
        res.render('recharge', {title: 'Recharge', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  withdraw(req, res, next) {
    User.find({})
      .then((user) => {
        res.render('withdraw', {title: 'Withdraw', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  transfer(req, res, next) {
    User.find({})
      .then((user) => {
        res.render('transfer', {title: 'Transfer', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }
}

module.exports = new WalletController;