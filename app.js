const express = require("express");
const app = express();

const cors = require("cors")
const cookieParser = require("cookie-parser");
const path = require("path");

const userModel = require("./Models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// environment variable
require("dotenv").config();

// cors setup
app.use(cors({
    origin: process.env.FRONTEND_URL ||"http://localhost:3000", //frontend url
    credentials:true //dor cookies use only
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))


app.get("/",(req,res)=>{
    console.log("Nodejs working");
    res.send("nodeJs working")
})

// signup
app.post("/create", (req,res)=>{
    let {fullname,email,password}= req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async(err,hash)=>{
            let createUser = await userModel.create({
                fullname,
                email,
                password:hash
            })
            const token = jwt.sign({ email }, process.env.JWT_SECRET || "secretkey");
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
})


// login
app.post("/login",async (req,res)=>{
    try{
        let user = await userModel.findOne({email:req.body.email});
        if(!user) return res.json({success:false,msg:"User not register!"});
        // check password
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.json({ success: false, msg: "Invalid password!" });

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "secretkey");
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

})


// dynamic port
const port = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log('Server running...');
    
});