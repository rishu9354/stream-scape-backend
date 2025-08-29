const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log("DB Connected.."))
.catch((err)=>console.error("DB Error: ",err))

module.exports = mongoose.connection;