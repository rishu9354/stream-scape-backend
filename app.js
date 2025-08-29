const express = require("express");
const app = express();

const cors = require("cors")
const cookieParser = require("cookie-parser");
const path = require("path");

const db = require("./config/mongoConfig");
const authRouter = require("./Routes/index")


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

app.use("/auth",authRouter);


app.get("/",(req,res)=>{
    res.send("Node js working..")
})

// app.get('/upload/:id',async (req,res)=>{
//     try {
//         let showdata = await showModel.findById(req.params.id).populate("episodes");
//         if(!showdata) return res.status(404).send("show data not found!")
//     console.log(showdata)
//     res.render("test",{showdata});
//     } catch (error) {
//          console.error(error);
//         res.status(500).send("Error loading upload page");
//     }
// })

// app.get("/show",(req,res)=>{
//     res.render("showdata")
// })
// // upload video routes

// app.post("/upload", async (req,res,next) => {
//     try {
//         console.log(req.body);
        
//         const file = req.files.photo;

//         // upload to cloudinary
//         const result = await cloudinary.uploader.upload(file.tempFilePath, (err,result)=>{
//             console.log(result);
            
//         })
//     } catch (error) {
        
//     }
// })

// dynamic port
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log('Server running...');
    
});