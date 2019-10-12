const express = require("express");
const Upload = require("../models/upload");
const auth = require("../middleware/auth");
const User = require('../models/user');
const router = new express.Router();
const multer = require("multer");
var path = require("path");
var fs = require('fs');
var gc = require('../middleware/google-cloud-storage')
var bucket = gc.bucket;
var mail = require("../mail/account");
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();
// Imports the Google Cloud client library

// var mulStorage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "./uploads");
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.originalname);
//     }
// });
// var upload = multer({ storage: mulStorage }).any("fileupload");

const gcs = require('../middleware/google-cloud-storage');

router.post("/uploads/upload", auth, gcs.multer.single('upload'),
    gcs.sendUploadToGCS, async (req, res, next) => {
        let upload = new Upload();
        upload.fileName = req.file.originalname;
        var fileType = path.extname(req.file.originalname).split(".")[1];
        var videoTypes = ['mp4','webm'];
        var audioType = ['mp3'];
        if(videoTypes.includes(fileType)) upload.fileType = "video/"+fileType;
        if(audioType.includes(fileType)) upload.fileType = "audio/"+fileType;
        upload.filePath = req.file.cloudStoragePublicUrl;
        upload.owner = req.user;
        await upload.save();
        var data = {
            "filePath": upload.filePath,
            "message": "Uploaded succesfully"
        }
        req.fileName = req.file.originalname;
        var emails = await User.find({},{email:1,_id:0});
        req.emails = getAllEmails(emails);
        console.log("emails ",  req.emails);
        mail.notifyAll(req);
        res.status(200).send(data);
    });

router.get("/uploads/file", auth, async (req, res) => {
    console.log(req.query.filename);
    var file = await Upload.find({ fileName: req.query.filename });
    console.log("file ", file);
    var respStream = fs.createReadStream(file[0].filePath);
    respStream.pipe(res);
});

//downloading files from the local dir.
router.get("/uploads/files", auth, async (req, res) => {
    try {
        let files = await Upload.find({});
        let filesArray = [];
        await mapData(files, res);
    } catch (e) {
        console.log("e ", e);
        res.status(400).send();
    }
});
router.delete("/uploads/file", auth, async (req, res) => {
    fs.unlink("./uploads/" + req.query.filename, async (err) => {
        if (err) {
            return res.status(400).send();
        }
        await Upload.findOneAndDelete({ fileName: req.query.filename })
        res.status(200).send()
    })
});

async function mapData(files, res) {
    var finalArray = [];
    count = 0;
    files.forEach(async file => {
        let fileData = {};
        fileData.name = file.fileName;
        fileData.type = file.fileType;
        fileData.createdAt = file.createdAt;
        fileData.fileUrl = file.filePath;
        fileData.updatedAt = file.updatedAt;
        var user = await User.findById(file.owner);
        fileData.uploadedBy = user.name;
        finalArray.push(fileData);
        ++count;
        if (count == files.length) {
            res.send(finalArray);
        }
    });
}
//Downloading files from cloud
router.get("/uploads/cloud/file", async (req, res) => {
    console.log(req.query.filename);
    var file = await Upload.find({ fileName: req.query.filename });
   
    var remoteFile = bucket.file(req.query.filename);

    remoteFile.createReadStream()
    .on('error', function(err) {})
    .on('response', function(response) {
        console.log("response ",response);
     })
    .on('end', function() {
      // The file is fully downloaded.
    })
    .pipe(res);
});
router.delete("/uploads/cloud/file", auth, async (req, res) => {
    var file = bucket.file(req.query.filename);
    file.delete().then(async function(data) {
        var apiResponse = data[0];
        await Upload.findOneAndDelete({ fileName: req.query.filename })
        res.status(200).send();
      });
});

function getAllEmails(emails){
    var finalEmails ="";
    emails.forEach(data=>{
        finalEmails+=","+data.email;
    });
    return finalEmails;
}

module.exports = router;
