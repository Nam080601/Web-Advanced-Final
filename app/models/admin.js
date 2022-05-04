const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
  username: {type: String, unique: true, notNull: true,},
  password: {type: String, notNull: true},
}, { timestamps: true, });

module.exports = mongoose.model('Admin', Admin);