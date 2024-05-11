import mongoose from "mongoose";
const Userschema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'PostRemedy',
    }],
    dp:{
      type:String,
    },
  }
  // { timestamps: true }
);

export const user = mongoose.model("user",Userschema);
// module.exports = user;
