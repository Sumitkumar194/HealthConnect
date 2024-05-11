import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    // unique: true
  },
  password: {
    type: String,
    // required: true
  },
  userType:{
    type:String,
  },
  degree: {
    type: String,
    // required: true
  },
  expertise: {
    type: String,
    // required: true
  },
  email:{
    type:String,
  }
});

 export const Doctor = mongoose.model('Doctor', doctorSchema);