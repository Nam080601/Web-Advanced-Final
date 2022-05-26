const joi = require("@hapi/joi");

const schemaRegister = joi.object({
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    phone: joi.string().regex(/^[0-9]+$/).max(11).required(),
    birthday: joi.date().required(),
    address: joi.string().required(),
})

const chemaLogin = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
})

const chemaChangePassword = joi.object({
    oldPassword: joi.string().required().label('Vui lòng điền mật khẩu cũ'),
    newPassword: joi.string().required().label('Vui lòng điền mật khẩu mới'),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).label('Nhập lại mật khẩu không chính xác'),
})


const chemaResetPassword = joi.object({
    newPass: joi.string().required().label('Vui lòng điền đầy đủ'),
    confPass: joi.string().valid(joi.ref('newPass')).label('Nhập lại mật khẩu không chính xác'),
})

const schemaWithdrawMoney = joi.object({
    card_number: joi.string().required().label('Vui lòng nhập số thẻ'),
    expiry_date: joi.date().required().label('Vui lòng nhập ngày hết hạn'),
    withdraw_money: joi.number().required().label("Vui lòng nhập số tiền"),
    cvv: joi.string().required().label("Vui lòng nhập mã cvv"),
});

const schemaTransferMoney = joi.object({
    phone_number: joi.string().regex(/^[0-9]+$/).min(10).max(10).required().label('Số điện thoại không hợp lệ'),
    transfer_money: joi.number().required().label('Vui lòng nhập số tiền'),
    message: joi.string().required().label('Vui lòng nhập tin nhắn'),
    fee_payer: joi.string().required().valid('Sender', 'Receiver').label('Thông tin người trả phí không hợp lệ'),
});

module.exports = {
    schemaRegister,
    chemaLogin,
    chemaChangePassword,
    chemaResetPassword,
    schemaWithdrawMoney,
    schemaTransferMoney,
};