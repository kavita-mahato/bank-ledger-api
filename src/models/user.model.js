const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required for creating an account"],
        trim: true,
        lowercase: true,
        match: [emailRegex, "Please provide a valid email address"],
        unique: [true, "Email already exists."]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating an account."]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should contain atleast 6 characters."],
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;
})

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;