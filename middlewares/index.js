const jwt = require("jsonwebtoken");
const cokies = require("cookie-parser")
const User = require("../models/userauthmodel")

exports.isLoggined = async(req,res,next) => {
    const token =  req.cookies.tok 
    // || req.header("Authorization").replace("Bearer ", "")
    // res.cookies.tok ||

    if(token){
      jwt.verify(token, process.env.SECRETKEY, async function(err, decoded) {
        if(!decoded){
            error = {
                name: 'TokenExpiredError ',
                message: 'jwt expired',
            }
            const jk = "hello veere"
            return res.send(`<html style="background-color: #9DE7F2;"><h3>${error.name} And You have loggedout,<h4> Want to <a href="/login">Login again.!!</a></h4></h3></html>`)

            next()
        }

        req.user = await User.findById(decoded.id)
        next()
          }) 

    }

    
    // return next(decoded.id)

    // var isExpiredToken = false;

    var dateNow = new Date();

    // if(decodedToken.exp < dateNow.getTime()/1000)

    // {
    //    isExpiredToken = true;
    // }
    
    // if(decoded.exp < dateNow.getTime()){
    //     return res.send("bhai token has expired")
    // }


    // next()
    // return res.send("token expire")
}


exports.isAdmin = async(req,res, next) =>{
    if(req.user.role === "admin"){
        next()
    }
    else{
        res.send(`<html style="background-color: #7f8c8d;">you do not have admin privileges</html>`)

    }
}
exports.isManager = async(req,res, next) => {
    if(req.user.role === "manager"){
        next()
    }
    else{
        res.send(`<html style="background-color: #7f8c8d;">you are not Manager</html>`)
    }
}





