const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const user = require("./db");

require("dotenv").config();
const userRouter = express.Router();

const signupValidation = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),

})

//forsignup
userRouter.post("/signup" ,async (req,res) => {
    const body = req.body;
    const success = signupValidation.safeParse(body);
    console.log(body)

    if(!success){
        return res.status(403).json({msg:"data is not valid"})
    }
    
    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(body.password, salt)
    const check = await user.findOne({
        email: body.email
    })

    if(check){
        return res.status(403).json({msg: "email already exist"})
    }
    try {
         const response = await user.create({
            firstname: body.firstname,
            lastname: body.lastname,
            username: body.username,
            email: body.email,
            password: securePass
         })

         const token = jwt.sign(response._id.toHexString() , process.env.SECRET)
         return res.json({token:token})
    } catch (error) {
        console.log(error)
        return res.json({msg:"Error while signing up"})
    }

})




//login api

userRouter.post("/login" ,async (req,res) =>{
    const body = req.body;
    const success = signupValidation.safeParse(body)

    if(!success){
        return res.status(411).json({msg: "invalid inputs"})
    }
    try{
        const Users = await user.findOne({
            email: body.email,
        })
     if(!Users){
        return res.status(403).json({msg:"enter correct email"})
     }
     const passCompare = bcrypt.compare(body.password , Users.password)
     if(passCompare){
        const token = jwt.sign(Users._id.toHexString(),process.env.SECRET);
        return res.json({token:token});
     }
     else{
        return res.status(403).json({error:"password does not match"})
     }

    }
    catch(error){
        console.log(error)
        return res.status(403).json({msg: "error while signing in"})
    }

})



module.exports = userRouter;

