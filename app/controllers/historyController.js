//Required models
const History = require('../models/history');

class HistoryController {
  index(req, res, next) {
    History.find({ username: req.user.username })
      .then((dt) => {
        //sort date ascending
        dt.sort((a,b) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });
        res.render('history', {title: 'History', data: JSON.parse(JSON.stringify(dt))});
      })
      .catch(next);
  }

  details(req, res, next) {
    History.findOne({ username: req.user.username, _id: req.params.id })
    .then((dt) => {
      if (dt) {
        res.render('transactionDetails', {title: 'Transaction Details', data: JSON.parse(JSON.stringify(dt))});
      }
      next();
    })
  }
}

module.exports = new HistoryController;