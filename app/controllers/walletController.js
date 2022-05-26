const formidable = require("formidable");

//Required models
const User = require('../models/user.model');
const History = require('../models/history');

//Required middlewares
const middleware = require("../middlewares/validator");

class WalletController {
  index(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        //console.log(user);
        res.render('wallet', {title: 'Wallet', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  // recharge request
  recharge(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        res.render('recharge', {title: 'Recharge', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  // withdraw request
  withdraw(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        res.render('withdraw', {title: 'Withdraw', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }
  async withdraw_post(req, res) {
    try {
      // check fields
      try {
        const result = await middleware.schemaWithdrawMoney.validateAsync(req.body);
      } catch (err) {
        return res.status(400).json({ code: 400, message: err.details[0].context.label });
      }

      let { card_number, expiry_date, withdraw_money, cvv } = req.body;
      withdraw_money = parseFloat(withdraw_money);
      
      if (card_number !== "111111") {
        return res
        .status(400)
        .json({ code: 400, message: "Thẻ không được hỗ trợ." });
      }
      if (expiry_date !== "2022-10-10" || cvv !== "411") {
        return res
        .status(400)
        .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
      }
      if (withdraw_money < 50000) {
        return res
        .status(400)
        .json({ code: 400, message: "Số tiền phải lớn hơn hoặc bằng 50,000đ." });
      }
      if (withdraw_money % 50000 !== 0){
        return res
        .status(400)
        .json({ code: 400, message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ." });
      }

      const user = await User.findOne({ username: req.user.username });
      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      let withdraw_fee = withdraw_money/100 * 5
      let curr_money = user.money;
      if (curr_money < (withdraw_money + withdraw_fee)) {
        return res
          .status(400)
          .json({ code: 400, message: "số tiền hiện tại không đủ" });
      }
      
      //check withdraw times
      const check_history = await History.find({ username: user.username, type: 'Withdraw' });
      check_history.sort((a,b) => { return new Date(b.date).getTime() - new Date(a.date).getTime() });
      const withdraw_date_diff = check_history[0].date.getDate() - check_history[1].date.getDate();
      const today = new Date().getDate()
      if (withdraw_date_diff === 0 && today === check_history[0].date.getDate()) {
        return res
        .status(400)
        .json({ code: 400, message: "Bạn đã thực hiện 2 giao dịch hôm nay" });
      }
      if (withdraw_money >= 5000000) {
        const history = new History({
          username: user.username,
          type: "Withdraw",
          receiver_phone_number: "",
          money: withdraw_money,
          message: "111111",
          status: "Pending",
        });
        await history.save();
        return res.status(200).json({ code: 200, message: "Thực hiện thành công, chờ admin xác minh" });
      }

      curr_money = user.money - withdraw_money - withdraw_fee;
      await User.findOneAndUpdate(
        { username: user.username },
        { money: curr_money }
      );
      // add history
      const history = new History({
        username: user.username,
        type: "Withdraw",
        receiver_phone_number: "",
        money: withdraw_money,
        message: "111111",
        status: "Success",
      });
      await history.save();
      return res
      .status(200)
      .json({ code: 200, message: "Rút tiền thành công" });
    } catch (error) {
      return res
      .status(400)
      .json({ code: 400, message: "Lỗi" });
    }

  }

  transfer(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        res.render('transfer', {title: 'Transfer', data: JSON.parse(JSON.stringify(user))});
      })
      .catch(next);
  }

  async transfer_post(req, res) {
    try {
      // check fields
      try {
        const result = await middleware.schemaTransferMoney.validateAsync(req.body);
      } catch (err) {
        return res.status(400).json({ code: 400, message: err.details[0].context.label });
      }

      let { phone_number, transfer_money, message, fee_payer } = req.body;
      transfer_money = parseFloat(transfer_money);

      if (transfer_money < 50000) {
        return res
        .status(400)
        .json({ code: 400, message: "Số tiền phải lớn hơn hoặc bằng 50,000đ." });
      }
      if (transfer_money % 50000 !== 0){
        return res
        .status(400)
        .json({ code: 400, message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ." });
      }

      const receiver_user = await User.findOne({ phone: phone_number});
      const sender_user = await User.findOne({ username: req.user.username });
      if (!receiver_user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      if (sender_user.phone === phone_number) {
        return res
        .status(400)
        .json({ code: 400, message: "Không thể tự gửi tiền cho bản thân" });
      }

      //check fee_payer
      let transfer_fee = transfer_money/100 * 5

      //Sender
      if (fee_payer === "Sender") {

        let curr_money = sender_user.money;
        if (curr_money < (transfer_money + transfer_fee)) {
          return res
            .status(400)
            .json({ code: 400, message: "số tiền hiện tại không đủ" });
        }

        //if money >= 5m
        if (transfer_money >= 5000000) {
          const history = new History({
            username: sender_user.username,
            type: "Transfer",
            receiver_phone_number: phone_number,
            money: transfer_money,
            message: message,
            status: "Pending",
          });
          await history.save();
          return res.status(200).json({ code: 200, message: "Thực hiện thành công, chờ admin xác minh" });
        }

        //update sender money
        curr_money = sender_user.money - transfer_money - transfer_fee;

        await User.findOneAndUpdate(
          { username: sender_user.username },
          { money: curr_money }
        );
        //update receiver money
        await User.findOneAndUpdate(
          { username: receiver_user.username },
          { money: receiver_user.money + transfer_money }
        );
        // add sender history
        const sender_history = new History({
          username: sender_user.username,
          type: "Transfer",
          receiver_phone_number: phone_number,
          money: transfer_money,
          message: message,
          status: "Success",
        });
        await sender_history.save();

        // add receiver history
        const receiver_history = new History({
          username: receiver_user.username,
          type: "Transfer",
          receiver_phone_number: sender_user.phone, //sender phone number
          money: transfer_money,
          message: message,
          status: "Success",
        });
        await receiver_history.save();
        return res
        .status(200)
        .json({ code: 200, message: "Chuyển tiền thành công" });
      }

      //Receiver
      if (fee_payer === "Receiver") {
        let curr_money = sender_user.money;
        if (curr_money < (transfer_money)) {
          return res
            .status(400)
            .json({ code: 400, message: "số tiền hiện tại không đủ" });
        }

        //if money >= 5m
        if (transfer_money >= 5000000) {
          const history = new History({
            username: sender_user.username,
            type: "Transfer",
            receiver_phone_number: phone_number,
            money: transfer_money,
            message: message,
            status: "Pending",
          });
          await history.save();
          return res.status(200).json({ code: 200, message: "Thực hiện thành công, chờ admin xác minh" });
        }

        //update sender money
        curr_money = sender_user.money - transfer_money;

        await User.findOneAndUpdate(
          { username: sender_user.username },
          { money: curr_money }
        );
        //update receiver money
        await User.findOneAndUpdate(
          { username: receiver_user.username },
          { money: receiver_user.money + transfer_money - transfer_fee}
        );
        // add sender history
        const sender_history = new History({
          username: sender_user.username,
          type: "Transfer",
          receiver_phone_number: phone_number,
          money: transfer_money,
          message: message,
          status: "Success",
        });
        await sender_history.save();

        // add receiver history
        const receiver_history = new History({
          username: receiver_user.username,
          type: "Transfer",
          receiver_phone_number: sender_user.phone, //sender phone number
          money: transfer_money,
          message: message,
          status: "Success",
        });
        await receiver_history.save();
        return res
        .status(200)
        .json({ code: 200, message: "Chuyển tiền thành công" });
      }

      
    } catch (error) {
      return res
      .status(400)
      .json({ code: 400, message: "Lỗi" });
    }

  }

  phonecards(req, res) {
    res.render('phonecards', { title: 'Phone Cards' });
  }

  phonecardsDetails(req, res) {
    res.render('phonecardsDetails', { title: 'Phone Cards Details' });
  }
}

module.exports = new WalletController;