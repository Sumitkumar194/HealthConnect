import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String,
  },
  userType:{
    type:String,
  },
  degree: {
    type: String,
  },
  expertise: {
    type: String,
  },
  email:{
    type:String,
  }
});

 export const Doctor = mongoose.model('Doctor', doctorSchema);