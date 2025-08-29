const userModel = require("../Models/user");
const bcrypt = require("bcrypt");

const {generateToken} = require("../utils/generateToken")
// const showModel = require("../Models/showdata.models")
module.exports.signUp = async (req,res)=>{

    try {
     let {fullname,email,password}= req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async(err,hash)=>{
            let createUser = await userModel.create({
                fullname,
                email,
                password:hash
            })
            let token = generateToken(createUser);
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
            res.json({
                success:true,
                createUser,
                token,
                msg:'User data save'
            })
            res.send(createUser)
        })
    })
    } catch (error) {
         res.send(err.message);
    }
}

module.exports.logIn = async (req,res)=>{
     try{
        let user = await userModel.findOne({email:req.body.email});
        if(!user) return res.json({success:false,msg:"User not register!"});
        // check password
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.json({ success: false, msg: "Invalid password!" });

        let token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

        res.json({
            success: true,
            user,
            token,
            msg: "Login successful!"
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
}

// module.exports.uploadShowData = async (req,res)=>{
//     try {
//         let {title,storyline,released,runtime,budget,popularity,language,vote,genres,reviews} = req.body;
//     // check the show data details will exists in our db or not
//     let poster = req.file.path;
//     let showData = await showModel.findOne({title:req.body.title});
//     if(showData) return res.status(500).send("Show data already registered");

   
//         let showdata = await showModel.create({
//             title,
//             poster
//             ,storyline,released,runtime,budget,popularity,language,vote,genres,reviews
//         });
//        return res.redirect(`/upload/${showdata._id}`);
        
//     } catch (error) {
//         console.error(error);
//     return res.status(500).json({ message: "Uploaded showdata  Error" });
//     }
    
// }