const History = require('../models/history');

class HistoryController {
  index(req, res, next) {
    History.find({})
      .then((dt) => {
        res.render('history', {title: 'History', data: JSON.parse(JSON.stringify(dt))});
      })
      .catch(next);
  }
}

module.exports = new HistoryController;