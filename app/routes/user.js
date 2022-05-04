const express = require("express");
const router = express.Router();

const User = require('../models/user');

router.get('/reset', (req, res, next) => {
  User.remove({})
    .then(() => console.log('remove ok!'))
    .catch(next);

  (new User({
    username: '2031526481',
    password: 'hubdgc',
    phone: '0865316425',
    email: 'ducnguyen@email.com',
    name: 'Nguyễn Thành Đức',
    birthday: new Date('2002-08-12'),
    address: '45 Đường Đinh Tiên Hoàng, Da Kao, District 1, Ho Chi Minh City',
    frontImage: '2031526481-front.png',
    backImage: '2031526481-back.png',
  })).save()
    .then(() => console.log('2031526481'))
    .catch(next);

  (new User({
    username: '6895136274',
    password: 'lpvdft',
    phone: '0945136248',
    email: 'huypham@email.com',
    name: 'Phạm Quang Huy',
    birthday: new Date('2001-01-21'),
    address: '860 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, Ho Chi Minh City',
    frontImage: '6895136274-front.png',
    backImage: '6895136274-back.png',
  })).save()
    .then(() => console.log('6895136274'))
    .catch(next);

  (new User({
    username: '1956235478',
    password: 'pnmfrx',
    phone: '0956217543',
    email: 'namle@email.com',
    name: 'Lê Lưu Nam',
    birthday: new Date('2000-11-17'),
    address: '236 Điện Biên Phủ, Phường 17, Bình Thạnh, Ho Chi Minh City',
    frontImage: '1956235478-front.png',
    backImage: '1956235478-back.png',
  })).save()
    .then(() => console.log('1956235478'))
    .catch(next);

  (new User({
    username: '9562135204',
    password: 'vbtfyr',
    phone: '08451362457',
    email: 'dando@email.com',
    name: 'Đỗ Linh Đan',
    birthday: new Date('2002-08-12'),
    address: '68 Phạm Ngọc Thạch, Vo Thi Sau Ward, District 3, Ho Chi Minh City',
    frontImage: '9562135204-front.png',
    backImage: '9562135204-back.png',
  })).save()
    .then(() => console.log('9562135204'))
    .catch(next);

  (new User({
    username: '6235126485',
    password: 'pacesg',
    phone: '0846953125',
    email: 'linhnhu@email.com',
    name: 'Nhữ Nam Linh',
    birthday: new Date('2004-05-26'),
    address: '126 Đường Cách Mạng Tháng 8, Võ Thị Sáu, District 3, Ho Chi Minh City',
    frontImage: '6235126485-front.png',
    backImage: '6235126485-back.png',
  })).save()
    .then(() => console.log('6235126485'))
    .catch(next);

  res.redirect('/');
});

router.get("/a", (req, res) => {
  res.render('home', {title: 'ahihi'});
});

router.post("/", (req, res) => {

});

router.get("/:slug", (req, res) => {

});

router.put("/:slug", (req, res) => {

});

router.delete("/:slug", (req, res) => {

});

router.get("/", (req, res, next) => {
  User.find({})
    .then((student) => {
      res.json(JSON.parse(JSON.stringify(student)));
    })
    .catch(next);
});

module.exports = router;