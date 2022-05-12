const {SECRETKEY, EXPIRYTIME} = process.env
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")


const cookietoken = (user, res) =>{
    // Generating The Token
    const token = jwt.sign({
        id : user._id,
    },SECRETKEY, 
    {
        expiresIn : "1h"
    })
    // saving token to DB
    user.token = token

// Generating cookies
    const opts = {
        expires: new Date(Date.now() +  3*24*60 * 60 * 1000),
        httpOnly: true,
    } // options for cookies

    res.status(200).cookie("tok", token, opts)
    //     .json({
    //     success: true,
    //     user,
    // })
}

module.exports = cookietoken