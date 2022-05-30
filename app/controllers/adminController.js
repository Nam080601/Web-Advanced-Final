const userModel = require('../models/user.model');
const history = require('../models/history');

class AdminController {
  async index(req, res, next) {
    const userWait = JSON.parse(JSON.stringify(await userModel.find({ status: 'chờ kích hoạt' })))
      .sort((a, b) => (a.createdAt < b.createdAt || a.cmnd)? 1: -1);
    const userAct = JSON.parse(JSON.stringify(await userModel.find({ status: 'đã kích hoạt' })))
      .sort((a, b) => (a.createdAt < b.createdAt)? 1: -1);
    const userDis = JSON.parse(JSON.stringify(await userModel.find({ status: 'đã bị vô hiệu hóa' })))
      .sort((a, b) => (a.createdAt < b.createdAt)? 1: -1);
    const userLock = JSON.parse(JSON.stringify(await userModel.find({ status: 'đang bị khóa vô thời hạn' })));
    const deals = JSON.parse(JSON.stringify(await history.find({status: 'Pending'})))
      .filter(elem => elem.money >= 5000000)
      .sort((a, b) => (a.date < b.date)? 1: -1);

    res.render('admin/admin.ejs', {title: 'Admin', userWait, userAct, userDis, userLock, deals});
  }

  async userDetail(req, res, next) {
    const user = JSON.parse(JSON.stringify(await userModel.findOne({ username: req.params.slug })));
    const deals = JSON.parse(JSON.stringify(await history.find({username: req.params.slug})))
      .filter(elem => (elem.date.substr(0, 4) == (new Date()).getFullYear() && elem.date.substr(5, 2) == ((new Date()).getMonth() + 1)))
      .sort((a, b) => (a.date < b.date)? 1: -1);

    res.render('admin/user-detail.ejs', {title: 'User Detail', user, deals});
  }

  async dealDetail(req, res, next) {
    const deal = JSON.parse(JSON.stringify(await history.find({}))).filter(elem => elem._id === req.params.id)[0];
    console.log(deal);
    res.render('admin/deal-detail.ejs', {title: 'Deal Detail', deal});
  }

  async act(req, res, next) {
    await userModel.updateOne({ username: req.params.slug}, req.body);
    res.redirect('/admin/users/' + req.params.slug)
  }

  async actD(req, res, next) {
    const user = JSON.parse(JSON.stringify(await userModel.findOne({ username: req.params.username })));
    const deal = JSON.parse(JSON.stringify(await history.find({}))).filter(elem => elem._id === req.params.id)[0];
    if (req.body.status === "cancelled") {
      await deal.updateOne({ _id: deal._id}, req.body);
    }
    else if (user.money > deal.money) {
      await userModel.updateOne({ username: req.params.username}, {money: user.money - deal.money});
      await history.updateOne({ _id: deal._id}, req.body);
    }
    else {
      res.send("Tiền tài khoản không đủ");
    }
    res.redirect('/admin')
  }
}

module.exports = new AdminController;