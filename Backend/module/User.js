import mongoose from "mongoose";
const Userschema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType:{
      type:String,
      required:true,
    }
  }
  // { timestamps: true }
);

export const UserSingle= mongoose.model("UserSingle",Userschema);
