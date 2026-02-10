import express from "express";
import {User} from "../models/user.js"
import { generateToken,jwtAuthMiddleware }from "../jwt.js";
const route = express.Router();


import generateOTP from "../utils/generateOTP.js";
import { sendOTPEmail } from "../utils/sendEmail.js";


// route.post('/signup',async (req,res)=>{
//     try {
//         const data = req.body;
//         const newUser = new User(data);
//         const response = await newUser.save();
//         console.log("data saved")
//         const payload = {
//           id:response.id,
//         }
//         console.log(JSON.stringify(payload));
//         const token = generateToken(payload);
//         console.log("Token is :" ,token);
//         res.status(200).json({response:response,token:token})
        
//     } catch (error) {
//         console.log(error);
//         res.status(200).json({error:"Internal Server Error"})
        
//     }
// })

route.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const otp = generateOTP();

    const newUser = new User({
      ...data,
      emailOTP: otp,
      emailOTPExpiry: Date.now() + 10 * 60 * 1000, // 10 min
      isEmailVerified: false,
    });

    await newUser.save();
    await sendOTPEmail(data.email, otp);

    res.status(201).json({
      message: "Account created. OTP sent to email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

route.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      user.emailOTP !== otp ||
      user.emailOTPExpiry < Date.now()
    ) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

route.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: "Email already verified" });
  }

  const otp = generateOTP();
  user.emailOTP = otp;
  user.emailOTPExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP resent successfully" });
});

 
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