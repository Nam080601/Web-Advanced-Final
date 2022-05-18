const userModel = require('../models/user.model');

class AdminController {
  async index(req, res, next) {
    const userWait = JSON.parse(JSON.stringify(await userModel.find({ status: 'chờ kích hoạt' })));
    const userAct = JSON.parse(JSON.stringify(await userModel.find({ status: 'đã kích hoạt' })));
    const userDis = JSON.parse(JSON.stringify(await userModel.find({ status: 'đã bị vô hiệu hóa' })));
    const userLock = JSON.parse(JSON.stringify(await userModel.find({ status: 'đang bị khóa vô thời hạn' })));

    const mongoose = require("../config/db");
    const Schema = mongoose.Schema;

    const deal = mongoose.model("deal", new Schema({
      username: { type: String, required: true, unique: true },
      createdAt: { type: Date, default: Date.now },
    }, { timestamps: true }));

    await (new deal({username: "2"})).save();

    res.render('admin', {title: 'Admin', userWait, userAct, userDis, userLock, deals: [{type: 'Type', money: 'Money', date: 'Date', status: 'Status'}]});
  }

  async userDetail(req, res, next) {
    const user = JSON.parse(JSON.stringify(await userModel.findOne({ username: req.params.slug })));
    res.render('user-detail', {title: 'User Detail', user, deals: [{type: 'Type', money: 'Money', date: 'Date', status: 'Status'}]});
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