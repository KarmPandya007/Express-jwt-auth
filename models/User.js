import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true, 
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        enum : ["admin", "manager", "user"],
        default : "user"
    }
}, {
    timestamps: true,
    // collection: "authPeople"
});

export const User = mongoose.model("User", userSchema);

