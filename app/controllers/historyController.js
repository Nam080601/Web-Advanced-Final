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
}

module.exports = new HistoryController;