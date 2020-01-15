const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
    filePath: {
        type: String,
        required: true,
        trim: true
    },
    fileType: {
        type: String,
        required : true
    },
    fileName: {
        type: String,
        required : true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
uploadSchema.index({fileName: 'text'});
const Upload = mongoose.model('Upload',uploadSchema)

module.exports = Upload