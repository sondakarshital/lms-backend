const mongoose = require('mongoose');
var uri = "mongodb://127.0.0.1:27017/users_test";

mongoose.connect(uri,{
    useNewUrlParser :true,
    useCreateIndex : true
});

