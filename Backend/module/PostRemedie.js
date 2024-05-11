import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  facilitator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FWomen', // Reference to the facilitator who created the post
    // required: true
  },
  image: {
    type: String, // URL of the image uploaded for the post
    required: true
  },
  issue: {
    type: String, // Issue or problem addressed by the remedy
    required: true
  },
  remedyName: {
    type: String, // Name of the remedy
    required: true
  },
  ingredients: {
    type: String, // Ingredients used in the remedy
    required: true
  },
  instructions: {
    type: String, // Instructions for preparing the remedy
    required: true
  },
  Uses:{
    type: String, // Instructions for preparing the remedy
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  likes: [{
   type:Number,
   default:0 // Array of user IDs who liked the post
  }],
  comments: [{
    text: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdat: {
      type: Date, // Timestamp of when the comment was created
      default: Date.now
    }
  }],
  createdAt: {
    type: Date, // Timestamp of when the post was created
    default: Date.now
  }
});

export const Post = mongoose.model('Post', postSchema);