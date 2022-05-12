const express = require("express")
const router = express.Router()
const {isLoggined, isAdmin, isManager} = require("../middlewares/index")
const { signup,
    findOne,
    findall, 
    login,
    forgotpassword,
    resetpassword,
    logout,
    deleteuser,
    deshbord,
    admindeshbord,
    managerdeshbord,
    findallAdmins,
    updateUserBymanager,
    usersonly
    } = require("./../controllers/controllers")

router.post("/signup", signup)
router.get("/findall", findall)
router.get("/findone/:Id",findOne)
router.post("/login",login)
router.post("/forgotpassword", forgotpassword)
router.post("/reset/password/:token", resetpassword)
router.get("/logout", logout)
router.get("/deshbord", isLoggined,deshbord)
router.get("/admindeshbord", isLoggined, isAdmin,usersonly)
router.get("/managerdeshbord", isLoggined, isManager ,findall)
router.get("/alladmin", isLoggined, isManager ,findallAdmins)
router.put('/manager/update/:Id',updateUserBymanager)

router.delete("/delete", isLoggined,deleteuser)








module.exports = router