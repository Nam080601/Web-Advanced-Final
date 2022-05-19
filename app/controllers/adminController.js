const userModel = require('../models/user.model');

const mongoose = require("../config/db");
const Schema = mongoose.Schema;

const deal = mongoose.model("deal", new Schema({
  username: { type: String, required: true, unique: true }
}, { timestamps: true }));

class AdminController {
  async index(req, res, next) {
    const userWait = JSON.parse(JSON.stringify(await userModel.find({ status: 'chờ kích hoạt' })))
    .sort((a, b) => (a.createdAt < b.createdAt || a.cmnd)? 1: -1);
    const userAct = JSON.parse(JSON.stringify(await userModel.find({ status: 'đã kích hoạt' })))
      .sort((a, b) => (a.createdAt < b.createdAt)? 1: -1);
    const userDis = JSON.parse(JSON.stringify(await userModel.find({ status: 'đã bị vô hiệu hóa' })))
      .sort((a, b) => (a.createdAt < b.createdAt)? 1: -1);
    const userLock = JSON.parse(JSON.stringify(await userModel.find({ status: 'đang bị khóa vô thời hạn' })));
    const deals = JSON.parse(JSON.stringify(await deal.find({})))
      .sort((a, b) => (a.createdAt < b.createdAt)? 1: -1);

    res.render('admin', {title: 'Admin', userWait, userAct, userDis, userLock, deals});
  }

  async userDetail(req, res, next) {
    const user = JSON.parse(JSON.stringify(await userModel.findOne({ username: req.params.slug })));
    const deals = JSON.parse(JSON.stringify(await deal.find({})))
      .filter(elem => (elem.createdAt.substr(0, 4) == (new Date()).getFullYear() && elem.createdAt.substr(5, 2) == ((new Date()).getMonth() + 1)))
      .sort((a, b) => (a.createdAt < b.createdAt)? 1: -1);

    res.render('user-detail', {title: 'User Detail', user, deals});
  }

  dealDetail(req, res, next) {
    res.render('deal-detail', {title: 'User Detail'});
  }

  async act(req, res, next) {
    await userModel.updateOne({ username: req.params.slug}, req.body);
    res.redirect('/admin/users/' + req.params.slug)
  }
}

module.exports = new AdminController;