//Required models
const History = require("../models/history");

class HistoryController {
  index(req, res, next) {
    History.find({ username: req.user.username })
      .then((dt) => {
        //sort date ascending
<<<<<<< HEAD
        dt.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        res.render("history", {
          title: "History",
          data: JSON.parse(JSON.stringify(dt)),
        });
=======
        dt.sort((a,b) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });
        res.render('wallet/history', {title: 'History', data: JSON.parse(JSON.stringify(dt))});
>>>>>>> 3d2e5d7d8d88921d27384001736a19d99171a372
      })
      .catch(next);
  }

  details(req, res, next) {
    History.findOne({ username: req.user.username, _id: req.params.id })
    .then((dt) => {
      if (dt) {
        res.render('wallet/transactionDetails', {title: 'Transaction Details', data: JSON.parse(JSON.stringify(dt))});
      }
      next();
    })
  }

  cardDetails(req, res, next) {
    console.log(req.params.id);
    History.findOne({ username: req.user.username, _id: req.params.id}) //req.user.username, //req.params.id
    .then((dt) => {
      if (dt) {
        console.log(dt);
        return res.render('wallet/phonecardDetails', {title: 'Phone card details', data: JSON.parse(JSON.stringify(dt))});
      }
      next();
    })
  }
}

<<<<<<< HEAD
module.exports = new HistoryController();
=======
module.exports = new HistoryController;
>>>>>>> 3d2e5d7d8d88921d27384001736a19d99171a372
