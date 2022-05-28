var nodemailer = require('nodemailer');

const sendMail = (toMail) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'face.recognition.engage@gmail.com',
          pass: 'Malushka@123'
        }
      });

    // var transporter = nodemailer.createTransport({
    //   host: "smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: "fa3eda66cf7e77",
    //     pass: "9744f9e83c3f8a"
    //   }
    // });
      
      var mailOptions = {
        from: 'face.recognition.engage@gmail.com',
        to: toMail,
        subject: `You're in, let's begin!`,
        text: 'Congratulations! Your account has been created. Please Login and enjoy the services'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports={
    sendMail
}