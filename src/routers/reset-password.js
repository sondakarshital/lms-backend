const express = require('express');
const router = new express.Router();
var path = require('path');
const User = require('../models/user');
const ResetPassword = require('../models/resetPassword');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const crypto = require('crypto');
const mail = require('../mail/account.js');

router.post("/user/reset-password", async (req, res) => {
    try {
        console.log("req", req.headers);
        let email = req.body.email;
        const user = await User.findOne({ email: email });
        console.log("user ", user)
        if (user) {
            var token = crypto.randomBytes(32).toString('hex');
            let password = new ResetPassword({
                userId: user._id.toString(),
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000 // 1 hour
            });
            var data = await password.save();
            req.token = token;
            req.userId = user._id.toString();
            mail.sendMail(req);
            res.status(200).send({ token: token, userId: user._id.toString() });
        } else {
            res.status(404).send({ message: req.body.email + " This email id is not registred" })
        }
    } catch (e) {
        res.status(400).send({ message: "Someting went wrong" });
    }
});

router.post("/user/reset-password/:token", async (req, res) => {
    var userId = req.body.userid;
    var token = req.params.token;
    var password = req.body.password;
    var resetPassword = await ResetPassword.findOne({ userId, resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (resetPassword) {
        var result = await bcrypt.compare(token, resetPassword.resetPasswordToken)
        let hashPassword = await bcrypt.hash(password, 8);
        if (token == resetPassword.resetPasswordToken) {
            var val = await User.find({ _id: userId });
            var data = await User.updateOne({ _id: userId },
                { $set: { password: hashPassword } }
            )
            console.log("data", data);
            res.status(200).send({ message: "Your password got changed successfully!!!!!!!" });

        } else {
            res.status(400).send({ message: "Someting went wrong" });
        }
    }else{
        res.status(400).send({ message: "Someting is not correct" });
    }
    
});

module.exports = router;
