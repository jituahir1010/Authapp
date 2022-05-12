const User = require("../models/userauthmodel");
const bcrypt = require("bcrypt")
const cookietoken = require("./../utils/utils")
const crypto = require("crypto")
const mailHelper = require("../utils/mailHelper");
const { send } = require("process");
const { render } = require("ejs");


exports.user = (req,res) => {
    const name = "hellobro"
    const email = "this is email"
    res.status(202).json({
        hello :"handgazxgdfx",
        secong : "<h2> Hello Bro it has h2 line tag</h2>",
        second : "ji han"
    })
}

exports.signup = async(req,res) => {
    try {
    const {name, email, password} = req.body

    // return res.status(202).json({
    //         success : true,
    //         // user : user
    //         name : name,
    //         email,
    //         password
    //     })

    if(!name || !email || !password){
        return res.status(404).send("Please enter name email, password")
    }

    const user = await User.create({
        
        name : name,
        email : email, 
        password : password
    
    })

    // user.password  = undefined
    cookietoken(user,res)
    res.send(`<html><style> body { background : linear-gradient(132deg, #44402e 0%, #df5d07 100%);   color: #CAD5E2;
    }
     </style> <h1>Hii ${user.name} <h2q>you signed up successfully, Please <a href="/login"> login!!!</a></h2q></h1></html>`)

    // return res.status(202).json({
    //     success : true,
    //     user : user
    // })
    
    } catch (error) {
        return error
    }

}

exports.login = async(req,res) => {
try {
        
        const {email, password} = req.body

      // check user is registred with us or not
        const user = await User.findOne({email})
        if(!(user)){
            return res.status(404).send("Please enter correct email and password")
        }
      // validate the password passed by user 
        const savedpassword = await user.password
        const checkpass =  await bcrypt.compare(password, savedpassword)
        if(!user || !checkpass){
            return res.send('Please enter correct email and password')
        }

        cookietoken(user,res)
        res.redirect('deshbord')

    }
    
    catch (error) {
        console.log(error)
    }
}

exports.forgotpassword = async(req,res) =>{
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(404).send("This user is not register with us")
    }
    // Generating a random string(Token)
    const token = crypto.randomBytes(20).toString("hex")

    const forgaotPasswordToken = crypto
    .createHash("sha256") 
    .update(token)
    .digest("hex")
//  Saving Token and TokenExpiry in DataBase
    user.forgotpasswordtoken = forgaotPasswordToken
    // user.forgotpasswordExpiry  = new Date.now + 20*60*1000
    user.forgotPasswordExpiry = Date.now() + 20*60*1000

// Creating Url which will go user in mail
    const myurl = `${req.protocol}://${req.get("host")}/api/v1/reset/password/${token}`

    await user.save({validateBeforeSave : false})
// Message to sent user
    const message = `hello bro copy and paste this url in your browser ${myurl}`


    try {

        const option = {
            email : user.email,
            sub : `Mail for changing Password of your's`,
            message : message
        }
        
        await mailHelper(option)

         res.json({
            success : "true",
            msg : "check your email",
            user
        })

        // return res.send(`<html style="background-color: #9DE7F2;><h3> Mail Sent on your Registred Mail <h5>Check your mail and copy url in your Browser</h5></h3></html>`)

    } catch (error) {

        user.forgotpasswordtoken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save({validateBeforeSave : false})

        return console.log(error)
    }

}


exports.resetpassword = async(req,res) => {
    const token = req.params.token
    const {password, confirmpassword} = req.body

    // encrypt the userpassed Token
    const encryptUserPassedToken = crypto
    .createHash("sha256") 
    .update(token)
    .digest("hex")

    const user = await User.findOne({
        forgotpasswordtoken : encryptUserPassedToken,
        forgotPasswordExpiry : {$gt : Date.now()}
    })

    if(!user){
        return res.status(402).send("user not found")
    }
    if(password !== confirmpassword){
        return res.status(404).send("password and confirm password is not matching")
    }

    user.password = password
    await user.save({validateBeforeSave : false})

    return  res.status(202).json({
        success : true,
        user 
    })

    // user.forgaotPasswordToken = undefined
    // user.forgotPasswordExpiry = undefined

    // await user.save()

    // return res.status(202).json({
    //     success : true,
    //     user 
    // })
}

exports.findOne = async(req,res) => {
    const id = req.params.Id
    const user = await User.findById(id)

    if(!user) {
        return res.status(404).send("User is not Found")
    }

    return res.status(202).render('updateform', {Id : user._id})
}

exports.updateUserBymanager = async(req,res) => {
    try {
        const {email, role, name} = req.body;
        const Id = req.params.Id

      
        const newData = {
            email, 
            role,
            name
        }
        
        const user = await User.findOneAndUpdate({ _id:Id }, { $set : req.body}, {new : true, runValidators : true, useFindAnsModify : false})
        
        res.status(200).render('updateduser', {user})
        

    } catch (error) {
        console.log(error)
    }
}

exports.findall = async(req,res) => {
    try {
        const users = await User.find()
        res.status(201).render('managerdeshbord', {title : "All users", users})
    } catch (error) {
        console.log(error)
    }
}

exports.findallAdmins = async(req,res) =>{
    try {
        const admins = await User.find({role : "admin"})
        res.status(201).render('alladmin', {title : "AllAdmins" ,admins })
    } catch (error) {
        console.log(error)
    }
}

exports.usersonly = async(req,res) => {
    try {
        const useronly = await User.find({role : "user"})
        if(!useronly){
           return res.status(404)
            .send(`<html style="background-color: #9DE7F2;"><h3>no User under you</h3></html>`)

        }
        res.status(201).render('admindeshbord', {title : "AllUsers", useronly})
    } catch (error) {
        console.log(error)
    }
}

exports.logout = (req,res) => {
    const opts = {
        expires: new Date(Date.now()),
        httpOnly: true,
    }
    res.status(200).cookie("tok", null, opts )
    .send(`<html style="background-color: #9DE7F2;"><h3>You have loggedout successfully,<h4> Want to <a href="/login">Login again.!!</a></h4></h3></html>`)
}


exports.deleteuser = (req,res) => {
    try {
        
    } catch (error) {
        console.log(error)
    }

}

exports.deshbord = (req,res) => {
    return res.status(200).render('userdeshbord')
}

exports.admindeshbord = (req,res) =>{
    res.status(200).render('admindeshbord')
}
exports.managerdeshbord = (req,res) =>{
    res.status(200).render('managerdeshbord')
}

