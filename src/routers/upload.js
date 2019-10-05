const express = require("express");
const Upload = require("../models/upload");
const auth = require("../middleware/auth");
const User = require('../models/user');
const router = new express.Router();
const multer = require("multer");
var path = require("path");
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).any("fileupload");

router.post("/uploads/upload", auth, (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        req.files.forEach(async function (file) {
            let upload = new Upload();
            upload.fileName = file.originalname;
            upload.fileType = path.extname(file.originalname);
            upload.filePath = path.resolve(file.path);
            upload.owner = req.user;
            await upload.save();
        });
        res.end("File is uploaded");
    });
});

router.get("/uploads/file", auth, async (req, res) => {
    console.log(req.query.filename);
    var file = await Upload.find({ fileName: req.query.filename });
    console.log("file ",file);
    var respStream = fs.createReadStream(file[0].filePath);
    respStream.pipe(res);
});

router.get("/uploads/files", auth, async (req, res) => {
    try{
        let files = await Upload.find({});
        let filesArray = [];
        await mapData(files,res);
    }catch(e){
        console.log("e ",e);
        res.status(400).send();
    }
});
router.delete("/uploads/file", auth, async (req, res) => {
    fs.unlink("./uploads/"+req.query.filename,async (err)=>{
        if(err)  {
            return res.status(400).send();
        }
        await Upload.findOneAndDelete({ fileName: req.query.filename})
        res.status(200).send()
    })
});



async function mapData(files,res){
    var finalArray = [];
    count = 0;
    files.forEach(async file=>{
        let fileData = {};
        fileData.name = file.fileName;
        fileData.type = file.fileType;
        fileData.createdAt = file.createdAt;
        fileData.updatedAt = file.updatedAt;
        var user = await User.findById(file.owner);
        fileData.uploadedBy = user.name;
        finalArray.push(fileData);
        ++count;
        if(count == files.length){
            res.send(finalArray);
        }
    });
}

module.exports = router;
