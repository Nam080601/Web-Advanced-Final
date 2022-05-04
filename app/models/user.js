const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: {type: String, unique: true, notNull: true,},
  password: {type: String, notNull: true},
  phone: {type: String, unique: true},
  email: {type: String, unique: true},
  name: {type: String, notNull: true},
  cmmd: {type: String, notNull: true},
  birthday: {type: Date},
  address: {type: String},
  frontImage: {type: String},
  backImage: {type: String},
}, { timestamps: true, });

module.exports = mongoose.model('User', User);