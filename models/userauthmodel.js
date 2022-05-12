const mongoose  = require("mongoose");
const bcrypt = require("bcrypt")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        maxlength : [20, "name length cann't go more then 20 char"],
        minlength : [3 , "minimun length should 3 chr  "]
    },
    email : {
        type : String,
        required : [true, "email is required"],
        unique : [true , "Please enter unique email "],
        validate: [validator.isEmail, "Please enter email in correct format"],
    },
    password : {
        type : String,
        required : [true, " enter the password "],
        minlength : [5, "password should be min 5 chr"],
        // select : false
    },

    role : {
        type : String,
        default : "user"
    },
    token : {
        type : String
    },
    forgotpasswordtoken : String,
    forgotPasswordExpiry : Date,
    myurl : String
})


// encrypt the pass 
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
  })





module.exports = mongoose.model("User", userSchema)