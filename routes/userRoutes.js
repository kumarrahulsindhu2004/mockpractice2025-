import express from "express";
import {User} from "../models/user.js"
import { generateToken,jwtAuthMiddleware }from "../jwt.js";
const route = express.Router();


route.post('/signup',async (req,res)=>{
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log("data saved")
        const payload = {
          id:response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is :" ,token);
        res.status(200).json({response:response,token:token})
        
    } catch (error) {
        console.log(error);
        res.status(200).json({error:"Internal Server Error"})
        
    }
})

route.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email})

        // if user does not exist or passwprd does not match return error
        if(!user || !await user.comparePassword(password)){
            return res.status(401).json({error:"Invalid username or password"})
        }
        
        // generate Token
        const payload={
            id:user.id,
        }
        const token = generateToken(payload)

         res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
})

route.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'Internal Server Error'})
    
  }
})

route.put('/profile/password',async(req,res)=>{
    try {
        const userId = req.user; //Extract the id from the token
        const {currentPassword,newPassword} = req.body

        const user = await User.findById(userId);

        if(!(await user.comparePassword(currentPassword))){
          return res.status(401).json({error:'invalid username or password'})
        }

        user.password=newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
})


export default route;