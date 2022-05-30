const formidable = require("formidable");

//Required models
const User = require("../models/user.model");
const History = require("../models/history");
const transferOTP = require("../models/transferOTP");

//Required middlewares
const middleware = require("../middlewares/validator");

//Require helper
const helper = require("../helper/helper");

class WalletController {
  index(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        //console.log(user);
        res.render("wallet/wallet", {
          title: "Wallet",
          data: JSON.parse(JSON.stringify(user)),
        });
      })
      .catch(next);
  }

  // recharge request
  recharge(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        res.render("wallet/recharge", {
          title: "Recharge",
          data: JSON.parse(JSON.stringify(user)),
        });
      })
      .catch(next);
  }
  async recharge_post(req, res) {
    try {
      // check fields
      console.log(req.body.card_number);
      try {
        const result = await middleware.schemaRechargeMoney.validateAsync(
          req.body
        );
      } catch (err) {
        return res
          .status(400)
          .json({ code: 400, message: err.details[0].context.label });
      }

      let { card_number, expiry_date, recharge_money, cvv } = req.body;
      recharge_money = parseFloat(recharge_money);

      const user = await User.findOne({ username: req.user.username }); //fake req.user.username: '2591335824'
      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      //check card number(111111, 222222, 333333)
      switch (card_number) {
        case "111111": {
          if (expiry_date !== "2022-10-10" || cvv !== "411") {
            return res
              .status(400)
              .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
          }

          let curr_money = user.money;
          let newMoney = recharge_money + curr_money;
          try {
            await User.findByIdAndUpdate(user.id, { money: newMoney });
          } catch (error) {
            console.log(error);
          }
          Createhistory(res, user, recharge_money, card_number);
          break;
        }
        case "222222": {
          if (expiry_date !== "2022-11-11" || cvv !== "443") {
            return res
              .status(400)
              .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
          }
          if (recharge_money > 1000000) {
            return res
              .status(400)
              .json({ code: 400, message: "Số tiền nạp tối đa là 1.000.000" });
          }
          let curr_money = user.money;
          let newMoney = recharge_money + curr_money;
          try {
            await User.findByIdAndUpdate(user.id, { money: newMoney });
          } catch (error) {
            console.log(error);
          }
          Createhistory(res, user, recharge_money, card_number);
          break;
        }
        case "333333": {
          if (expiry_date !== "2022-12-12" || cvv !== "577") {
            return res
              .status(400)
              .json({ code: 400, message: "Thông tin thẻ không hợp lệ" });
          }
          return res.status(400).json({ code: 400, message: "Thẻ hết tiền" });
        }
        default: {
          return res
            .status(400)
            .json({ code: 400, message: "Thẻ không được hỗ trợ." });
        }
      }

      if (recharge_money < 50000) {
        return res
          .status(400)
          .json({
            code: 400,
            message: "Số tiền phải lớn hơn hoặc bằng 50,000đ.",
          });
      }

      if (recharge_money % 50000 !== 0) {
        return res
          .status(400)
          .json({
            code: 400,
            message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ.",
          });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }

  // withdraw request
  withdraw(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        res.render("wallet/withdraw", {
          title: "Withdraw",
          data: JSON.parse(JSON.stringify(user)),
        });
      })
      .catch(next);
  }
  async withdraw_post(req, res) {
    try {
      // check fields
      try {
        const result = await middleware.schemaWithdrawMoney.validateAsync(
          req.body
        );
      } catch (err) {
        return res
          .status(400)
          .json({ code: 400, message: err.details[0].context.label });
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
        return res.status(400).json({
          code: 400,
          message: "Số tiền phải lớn hơn hoặc bằng 50,000đ.",
        });
      }
      if (withdraw_money % 50000 !== 0) {
        return res.status(400).json({
          code: 400,
          message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ.",
        });
      }

      const user = await User.findOne({ username: req.user.username });
      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }
      let withdraw_fee = (withdraw_money / 100) * 5;
      let curr_money = user.money;
      if (curr_money < withdraw_money + withdraw_fee) {
        return res
          .status(400)
          .json({ code: 400, message: "số tiền hiện tại không đủ" });
      }

      //check withdraw times
      const check_history = await History.find({
        username: user.username,
        type: "Withdraw",
      });
      check_history.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      const withdraw_date_diff =
        check_history[0].date.getDate() - check_history[1].date.getDate();
      const today = new Date().getDate();
      if (
        withdraw_date_diff === 0 &&
        today === check_history[0].date.getDate()
      ) {
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
        return res.status(200).json({
          code: 200,
          message: "Thực hiện thành công, chờ admin xác minh",
        });
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
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }

  transfer(req, res, next) {
    User.findOne({ username: req.user.username })
      .then((user) => {
        res.render("wallet/transfer", {
          title: "Transfer",
          data: JSON.parse(JSON.stringify(user)),
        });
      })
      .catch(next);
  }

  async transfer_post(req, res) {
    try {
      // check fields
      try {
        const result = await middleware.schemaTransferMoney.validateAsync(
          req.body
        );
      } catch (err) {
        return res
          .status(400)
          .json({ code: 400, message: err.details[0].context.label });
      }

      let { phone_number, transfer_money, message, fee_payer } = req.body;
      transfer_money = parseFloat(transfer_money);

      if (transfer_money < 50000) {
        return res
          .status(400)
          .json({
            code: 400,
            message: "Số tiền phải lớn hơn hoặc bằng 50,000đ.",
          });
      }
      if (transfer_money % 50000 !== 0) {
        return res
          .status(400)
          .json({
            code: 400,
            message: "Số tiền phải là bội số của 50,000đ. Vd: 100,000đ.",
          });
      }

      const receiver_user = await User.findOne({ phone: phone_number });
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
      let transfer_fee = (transfer_money / 100) * 5;

      //Sender
      if (fee_payer === "Sender") {
        let curr_money = sender_user.money;
        if (curr_money < transfer_money + transfer_fee) {
          return res
            .status(400)
            .json({ code: 400, message: "số tiền hiện tại không đủ" });
        }

        const OTP = helper.generateRandomNumber(6);
        console.log(OTP);
        await helper.sendEmailTransferOTP(sender_user.email, OTP);

        const transfer_otp = new transferOTP({
          sender_username: sender_user.username,
          receiver_username: receiver_user.username,
          fee_payer: "Sender",
          money: transfer_money,
          message: message,
          createAt: Date.now(),
          OTP: OTP,
        });
        await transfer_otp.save();
        return res
          .status(200)
          .json({ code: 200, message: "Mã OTP đã được gửi đến email" });
      }

      //Receiver
      if (fee_payer === "Receiver") {
        let curr_money = sender_user.money;
        if (curr_money < transfer_money) {
          return res
            .status(400)
            .json({ code: 400, message: "số tiền hiện tại không đủ" });
        }

        const OTP = helper.generateRandomNumber(6);
        console.log(OTP);
        await helper.sendEmailTransferOTP(sender_user.email, OTP);

        const transfer_otp = new transferOTP({
          sender_username: sender_user.username,
          receiver_username: receiver_user.username,
          fee_payer: "Receiver",
          money: transfer_money,
          message: message,
          createAt: Date.now(),
          OTP: OTP,
        });
        await transfer_otp.save();
        return res
          .status(200)
          .json({ code: 200, message: "Mã OTP đã được gửi đến email" });
      }
    } catch (error) {
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }

  verifyOTP(req, res) {
    res.render("wallet/walletOTP", { title: "Enter OTP" });
  }

  async verifyOTP_post(req, res) {
    try {
      const { OTP_number } = req.body;

      if (!OTP_number || OTP_number.length !== 6) {
        return res.status(400).json({ code: 400, message: "OTP không hợp lệ" });
      }

      const tmp = await transferOTP.find({
        sender_username: req.user.username,
      });
      tmp.sort((a, b) => {
        return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
      });
      const dt = tmp[0];

      if (!dt) {
        return res.status(400).json({ code: 400, message: "OTP hết hạn" });
      }

      if (new Date(dt.createAt).getTime() + 60000 < Date.now()) {
        return res.status(400).json({ code: 400, message: "OTP hết hạn" });
      }

      if (OTP_number !== dt.OTP) {
        return res.status(400).json({ code: 400, message: "Sai OTP" });
      }

      // process transactions
      let transfer_fee = (dt.money / 100) * 5;
      const receiver_user = await User.findOne({
        username: dt.receiver_username,
      });
      const sender_user = await User.findOne({ username: req.user.username });

      if (dt.money >= 5000000) {
        const history = new History({
          username: sender_user.username,
          type: "Transfer",
          receiver_phone_number: receiver_user.phone,
          money: dt.money,
          message: message,
          status: "Pending",
        });
        await history.save();
        return res
          .status(200)
          .json({
            code: 200,
            message: "Giao dịch thành công, chờ admin xử lý.",
          });
      }

      // Sender
      if (dt.fee_payer === "Sender") {
        let curr_money = sender_user.money - dt.money - transfer_fee;
        //update sender money
        await User.findOneAndUpdate(
          { username: sender_user.username },
          { money: curr_money }
        );
        //update receiver money
        await User.findOneAndUpdate(
          { username: receiver_user.username },
          { money: receiver_user.money + dt.money }
        );
        //console.log("Update Sender Success")
      }

      //Receiver
      if (dt.fee_payer === "Receiver") {
        let curr_money = sender_user.money - dt.money;
        //update sender money
        await User.findOneAndUpdate(
          { username: sender_user.username },
          { money: curr_money }
        );
        //update receiver money
        await User.findOneAndUpdate(
          { username: receiver_user.username },
          { money: receiver_user.money + dt.money - transfer_fee }
        );
        //console.log("Update Receiver Success")
      }

      // add sender history
      const sender_history = new History({
        username: sender_user.username,
        type: "Transfer",
        receiver_phone_number: receiver_user.phone,
        money: dt.money,
        message: dt.message,
        status: "Success",
      });
      await sender_history.save();

      // add receiver history
      const receiver_history = new History({
        username: receiver_user.username,
        type: "Transfer",
        receiver_phone_number: sender_user.phone,
        money: dt.money,
        message: dt.message,
        status: "Success",
      });
      await receiver_history.save();
      console.log("Add History Success");

      return res
        .status(200)
        .json({ code: 200, message: "Chuyển tiền thành công" });
    } catch (error) {
      res.status(400).json({ code: 400, message: "lỗi" });
    }
  }

  phonecards(req, res, next) {
    User.find({})
      .then((user) => {
        res.render("wallet/phonecards", {
          title: "Phonecards",
          data: JSON.parse(JSON.stringify(user)),
        });
      })
      .catch(next);
  }
  async phonecards_post(req, res) {
    try {
      const user = await User.findOne({ username: req.user.username });
      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Tài khoản không tồn tại" });
      }

      let { nhacungcap, menhgia, soluong } = req.body;
      let curr_money = user.money;
      let total_monney = menhgia * soluong;

      if (total_monney > curr_money) {
        return res
          .status(400)
          .json({ code: 400, message: "Số tiền trong tài khoản không đủ" });
      }

      if (total_monney < curr_money) {
        let newMoney = curr_money - total_monney;
        try {
          await User.findByIdAndUpdate(user.id, { money: newMoney });
        } catch (error) {
          console.log(error);
        }
      }

      let id_card = [];
      let code;
      if (soluong > 5) {
        return res
          .status(400)
          .json({ code: 400, message: "Chỉ được mua tối đa 5 thẻ" });
      }
      if (soluong < 1) {
        return res
          .status(400)
          .json({ code: 400, message: "Số lượng thẻ không hợp lệ" });
      }
      switch (nhacungcap) {
        case "viettel": {
          if (soluong > 0) {
            for (let i = 0; i < soluong; i++) {
              let random_card = Math.floor(Math.random() * 100001);
              code = "11111" + random_card;
              id_card.push(code);
            }
          }
          break;
        }
        case "mobifone": {
          if (soluong > 0) {
            for (let i = 0; i < soluong; i++) {
              let random_card = Math.floor(Math.random() * 100001);
              code = "22222" + random_card;
              id_card.push(code);
            }
          }
          break;
        }
        case "vinaphone": {
          if (soluong > 0) {
            for (let i = 0; i < soluong; i++) {
              let random_card = Math.floor(Math.random() * 100001);
              code = "33333" + random_card;
              id_card.push(code);
            }
          }
          break;
        }
        default: {
          return res
            .status(400)
            .json({ code: 400, message: "Nhà cung cấp không hợp lệ" });
        }
      }
      CreatehistoryCard(
        res,
        user,
        nhacungcap,
        menhgia,
        soluong,
        total_monney,
        id_card
      );
      return res
        .status(200)
        .json({
          code: 200,
          message: "Mua thẻ thành công",
          data: { nhacungcap, menhgia, soluong, total_monney, id_card },
        });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ code: 400, message: "Lỗi" });
    }
  }
}

//add history recharge
async function Createhistory(res, user, recharge_money, card_number) {
  const history = new History({
    username: user.username,
    type: "Recharge",
    receiver_phone_number: "",
    money: recharge_money,
    message: card_number,
    status: "Success",
  });

  await history.save();
  // console.log(history)
  // return res
  // .status(200)
  // .json({ code: 200, message: "Nạp tiền thành công" });
}

//add history card
async function CreatehistoryCard(
  res,
  user,
  nhacungcap,
  menhgia,
  soluong,
  moneyBuyCards,
  id_card
) {
  const history = new History({
    username: user.username,
    nhacungcap: nhacungcap,
    menhgia: menhgia,
    soluong: soluong,
    type: "Buy Card",
    money: moneyBuyCards,
    message: id_card.toString(),
    status: "Success",
  });

  await history.save();
  //console.log(history)
}

module.exports = new WalletController();
