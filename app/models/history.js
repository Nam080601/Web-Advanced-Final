const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const History = new Schema({
    type: {
        type: String,
        required: true,
    },
    // ------------ if rechage or withdraw or buy cards ------------
    card_id: {
        type: String,
    },
    //--------------------------------------------------------------
    // ------------ if transfer monney ----------------
    receiver_phone_number: {
        type: String,
    },
    // ------------------------------------------------
    money: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
    }
})

module.exports = mongoose.model("History", History);