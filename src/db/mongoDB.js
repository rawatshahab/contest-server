const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
module.exports.mongoDBConnectionHandler = async ()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URI);
       console.log("Mongo DB connected");
    }catch(err){
        console.log(err)
    }
}
