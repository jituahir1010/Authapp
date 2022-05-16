require('dotenv').config()

const express = require("express");
const app  = express()
const morgan = require("morgan");
const userauth = require("./routes/route")
const cookieParser = require('cookie-parser')

const port = process.env.Port || 5000

// Importing mongoDB connection
const connectDB = require("./config/index")
// DB connection
connectDB()

// ejs engine 
app.set("view engine", "ejs")
// to serve static files like css,images(jpg.png,etc.) ; put all the static files in public folder
app.use(express.static('public'))

// middlewares goes here
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()); 
// all Routes goes here
app.use("/authapi/v1", userauth)

// log middleware goes here
app.use(morgan('tiny'))


app.get("/login", (req,res) => {
    res.render('login')
})

app.get("/signupform", (req, res) => {
    res.render('signupform');
  });

  app.get("/forgotpassword", (req, res) => {
    res.render('forgotpass');
  });

  app.get('/',(req,res) => {
    res.render('mainpage')
  })



app.listen(port, () => {
    console.log(`server is up and running on port  ${port}`)
})