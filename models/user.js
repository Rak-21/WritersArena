var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:{type:String, unique:true, required: true},
    password: String,
    avatar:String,
    firstName:String,
    lastName:String,
    bio:String,
    email:{type:String, unique:true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires:Date,
    isAdmin:{type:Boolean,default:false},
    facebook:String,
    twitter:String,
    instagram:String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);
