const Verifier = require("email-verifier");
let emailverificationApiKey = "at_zySlsCvCfCi5BFpM6yqqZPHTN4VS1";
let verifier = new Verifier(emailverificationApiKey);
//https://emailverification.whoisxmlapi.com/login
module.exports.mailVerifier =  function (email,callback) {
    var result = "";
     verifier.verify(email, (err, data) => {
         console.log("data ",data);
        if (err) {
            result = "Not valid email id";
            return callback(result,null);
        }
        if(data.smtpCheck=='true'){
            result = "valid email id" ;
            return callback(null,result);
        }else{
            result = "Not valid email id";
            return callback(result,null);
        }
        return callback(null,result);
    });
   
}