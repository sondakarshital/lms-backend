const mongoose = require('mongoose')

const resetPasswordSchema = new mongoose.Schema({
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    userId: {
        type: String
    }
})

const ResetPassword = mongoose.model('Resetpassword',resetPasswordSchema);

module.exports = ResetPassword;