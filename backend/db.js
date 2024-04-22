const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/FORM')
.then(() => {
    console.log("mongodb connected")
})

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password:String
})

const User = mongoose.model("user" , userSchema)

module.exports = User;