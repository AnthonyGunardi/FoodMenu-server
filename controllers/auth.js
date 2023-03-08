const User = require('../model/user');

exports.register = async (req,res,next)=>{
    try {
        const name=req.body.name;
        const email=req.body.email;
        const wa_number=req.body.wa_number;
 
        const user = await User.findOne({email:email})
        if (user) {
            return res.status(401).json({message:"User already exist!"})
        }
        const newUser = await User.create({ name, email, wa_number })
        return res.status(201).json(newUser)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}