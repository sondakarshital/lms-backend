const express = require('express');
const router = new express.Router();
const mailVerifier = require("../mail/mailVerifier");

router.post("/user/verify-email",async (req,res)=>{
     await mailVerifier.mailVerifier(req.body.email,(err,data)=>{
        if(err){
            res.status(400).send({message : err});
        }else{
            res.status(200).send({message:data});
        }
    });
   
});
module.exports = router;