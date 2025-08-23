const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log("DB Connected.."))
.catch((err)=>console.error("DB Error: ",err))

const userSchema = mongoose.Schema({
    fullname:String,
    email:{type:String, unique:true},
    password:String
});
module.exports = mongoose.model("user",userSchema);