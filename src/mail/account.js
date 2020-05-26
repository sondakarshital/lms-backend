var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var client = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '*@gmail.com',
    pass: '**'
  }
});
module.exports.sendMail = function (req) { 
      var email = {
        from: '*@gmail.com',
        to: req.email,
        subject: 'LMS reset password link',
         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          '' + req.headers.origin + '/password-reset?token='+req.token +"&userid="+req.userId +'\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      client.sendMail(email, function(err, info){
        if (err ){
          console.log(err);
        }
        else {
          console.log('Message sent: ' + info.response);
        }
    });
};
module.exports.notifyAll = function(req){
  
  var email = {
    from: '*@gmail.com',
    to: req.emails,
    subject: 'Uploaded new content on LMS',
     text: 'Your friend just uploaded '+ req.fileName+' file.Log in here to see'+' '+req.headers.origin
  };
  client.sendMail(email, function(err, info){
    if (err ){
      console.log(err);
    }
    else {
      console.log('Message sent: ' + info.response);
    }
});
}
