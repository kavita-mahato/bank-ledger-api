const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Database connected successfully...");
    })
    .catch(err => {
        console.log("ERROR! Database connection failed!");
        process.exit(1);
    })
}

module.exports = connectDB;