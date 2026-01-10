import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   email: {
      type: String,
      required: true,
      unique: true, // prevent duplicate accounts
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    age:{
        type:Number,
    },
//    mobile: {
//       type: String,
//       unique: true,
//       match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
//     },
     address:{
        type:String,
        
    },
     password: {
      type: String,
      required: true,
      minlength: 6, // basic password rule
    },
    profile: {
      education_level: { type: String },
      target_exam: [{ type: String }], // ["tcs", "wipro", "govt"]
      college_name: { type: String },
      location: { type: String },
    },
})


userSchema.pre('save',async function (next) {
const user = this

// Has the password only if has been modified or in new
if(!user.isModified('password')) return next()
    try {
        // hash password generation
        const salt = await bcrypt.genSalt(10);
        // hash password

        const hashedPassword = await bcrypt.hash(user.password,salt)

        // override the palin password with the hashed one
        user.password=hashedPassword
        next();
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword,this.password)
        return isMatch
    } catch (error) {
        throw error
    }
} 
export const User = mongoose.model('User',userSchema);