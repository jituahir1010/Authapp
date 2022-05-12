const nodemailer = require("nodemailer");
const mailHelper = async(option) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "7dca4d74e0373f",
          pass: "00a831878bd066"
        }
      });;

     const msg =  {
        from: 'jiturao998@gamil.com', // sender address
        to: option.email, // list of receivers
        subject: option.sub, // Subject line
        text: option.message, // plain text bod
        // html: {
        //   path: '/home/pankaj/Desktop/Lco/BackEnd1/expressauth/views/copied.html'
        // }

        // 'Embedded image: <img src="cid:jitu.jpg"  width = "100", height: "100" /> <br> <h3>Hello this is from h3 Tag</h3>',
      //   attachments: [ {   // filename and content type is derived from path
      //     path: '/home/pankaj/Desktop/Lco/BackEnd1/expressauth/views/copied.html'
      // }]
      }
    
      // send mail with defined transport object
       await transporter.sendMail(msg);

}

module.exports = mailHelper
