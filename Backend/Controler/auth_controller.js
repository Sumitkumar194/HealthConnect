import { hpassword, compassword } from "../helper/auth.js";
import { UserSingle } from "../module/User.js";
import { FWomen } from "../module/FacilatorWomen.js";
import { Post } from "../module/PostRemedie.js";
import path from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Doctor } from "../module/Docter.js";
import { router } from "../Roter/auth-router.js";
import { truncateSync } from "fs";
const secret = "helloiamsumitkumarahirwar6thsem";
// HOme ROute
export const test = (req, res) => {
  res.send("The Route is working");
};

export const Schema = async (req, res) => {
  const docs = await UserSingle.find({});
  const docs2 = await FWomen.find({});
  let show = [docs, docs2];
  res.json(show);
  console.log("Schema Dikh raha hai");
};

// Authtoken
const generateAuthToken = (userId, userType) => {
  const token = jsonwebtoken.sign(
    { user: { id: userId, type: userType } },
    secret
  ); // Adjust expiry time as needed
  return token;
};

export const loginuser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const find = await UserSingle.findOne({ username });
    console.log(find);
    if (!find) {
      const find2 = await FWomen.findOne({ username });
      console.log(find2);
      if (!find2) {
        const find3 = await Doctor.findOne({ username });
        if (!find3) {
          console.log("User not found");
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
        if (find3.password == password) {
          const userId = find3._id;
          const userType = find3.userType;
          const authtoken = generateAuthToken(userId, userType);
          return res.status(200).json({
            success: true,
            message: "Doctor found and password is correct",
            authtoken: authtoken,
          });
        } else {
          console.log("Password is incorrect");
          return res
            .status(401)
            .json({ success: false, message: "Password is incorrect " });
        }
      }
      if (find2.password == password) {
        const userId = find2._id;
        const userType = find2.userType;
        const authtoken = generateAuthToken(userId, userType);
        return res.status(200).json({
          success: true,
          message: "Facilator found and password is correct",
          authtoken: authtoken,
        });
      } else {
        console.log("Password is incorrect");
        return res
          .status(401)
          .json({ success: false, message: "Password is incorrect " });
      }
    }
    if (find.password == password) {
      const userId = find._id;
      const userType = find.userType;
      const authtoken = generateAuthToken(userId, userType);
      return res.status(200).json({
        success: true,
        message: "User found and password is correct",
        authtoken: authtoken,
      });
    } else {
      console.log("Password is incorrect");
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect " });
    }
  } catch (error) {
    console.error("Something went wrong during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong during login" });
  }
};

// Registerkaro
export const Registerkaro = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, password, userType, confirmPassword } = req.body;
    const exist = await UserSingle.findOne({ email });
    const exist2 = await FWomen.findOne({ email });
    const exist3 = await FWomen.findOne({ email });
    if (exist) {
      return res
        .status(500)
        .json({ success: false, message: "User Is already Exist" });
    } else if (exist2) {
      return res
        .status(500)
        .json({ success: false, message: "Facilator Is already Exist" });
    } else if (exist3) {
      return res
        .status(500)
        .json({ success: false, message: "Doctor Is already Exist" });
    } else if (password != confirmPassword) {
      return res
        .status(500)
        .json({ success: false, message: "Password is Not Matched" });
    }
    // const salt = await bcrypt.genSalt(10);
    // let hashedpassword = await bcrypt.hash(password,salt);
    if (userType === "User") {
      // Create a new user document
      const newUser = new UserSingle();
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.userType = req.body.userType;
      // Save the user to the database
      let Clg = await newUser.save();
      console.log(Clg);
    } else if (userType === "Facilator Women") {
      // Create a new facilitator women document
      const newFacilitator = new FWomen();
      newFacilitator.username = req.body.username;
      newFacilitator.email = req.body.email;
      newFacilitator.password = req.body.password;
      newFacilitator.userType = req.body.userType;
      // Save the facilitator women to the database
      let Clg = await newFacilitator.save();
      console.log(Clg);
    } else if (userType === "Doctor") {
      // Create a new facilitator women document
      const newDocter = new Doctor();
      newDocter.username = req.body.username;
      newDocter.email = req.body.email;
      newDocter.password = req.body.password;
      newDocter.userType = req.body.userType;
      // Save the facilitator women to the database
      let Clg = await newDocter.save();
      console.log(Clg);
    } else {
      return res.status(400).json({ message: "Invalid userType" });
    }
    // Registration successful
    res.status(201).json({ message: "Registration successful from backend" });
  } catch (error) {
    console.log("Error in Register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CreatePost image store location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Image");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
});

//jwt verify
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log("Helo ji from token",token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  jsonwebtoken.verify(token, secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized token Sumit: Invalid token" });
    }
    // Store the decoded user data in the request object for future use
    req.userId = decoded.user.id;
    req.userType = decoded.user.type; // Assuming you have a userType property in the token payload
    next();
  });
};

//upload
export const upload1 = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("From upload : ", userId);
    let POST = new Post();
    POST.ingredients = req.body.ingredients;
    POST.instructions = req.body.instructions;
    POST.issue = req.body.issue;
    POST.remedyName = req.body.remedyName;
    POST.Uses = req.body.Uses;
    POST.facilitator = userId;
    POST.status = 'pending';
    POST.image = "http://localhost:8000/Image/" + req.file.filename;

    let SAVEPOST = await POST.save();
    console.log(SAVEPOST);
    await FWomen.findByIdAndUpdate(userId, { $push: { posts: SAVEPOST._id } });

    return res.status(201).json(SAVEPOST);
  } catch (error) {
    console.error("Something went wrong :", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong ",
    });
  }
};

//profile route
export const profile = async (req, res) => {
  try {
    // Assuming you have set userType in the request object in the middleware
    const userType = req.userType;
    console.log(userType);
    // Get the user ID or email from the request object
    const userId = req.userId;
    // console.log(userId);
    let user;
    // Depending on the userType, fetch user data from the appropriate collection
    if (userType === "User") {
      user = await UserSingle.findById(userId);
    } else if (userType === "Facilator Women") {
      user = await FWomen.findOne({ _id: userId }); // Find by email
    } else if (userType === "Doctor") {
      user = await Doctor.findOne({ _id: userId }); // Find by email
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data in the response
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Facilatorpost = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Dekhte hai kya hai", userId);
    const Userposts = await FWomen.findById(userId).populate("posts");
    // console.log("Poplate data",Userposts)
    if (!Userposts) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const Onlypost = Userposts.posts;
    console.log(Onlypost);
    return res.json({
      message: "The Facilator post in come",
      success: true,
      Onlypost,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//

export const fetcDocter = async (req,res) =>{
  try {
    const userId = req.userId;
    console.log("Dekhte hai Doctor saheb koi", userId);
    const finddocter = await Doctor.findById(userId);

    console.log(Docterdata)
    console.log("The data from the data ",finddocter);
    if (!finddocter) {
      return res
        .status(404)
        .json({ message: "Docter not found", success: false });
    }
    console.log("Docter saheb",finddocter);
    return res.status(200).json({
      message:"The docter is find",
      success:true,
      finddocter
    })
  } catch (error) {
    return res.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
};
export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    // Find the post by ID and populate the likes array
    const post = await Post.findById(postId).populate("likes");
    // Include the number of likes in the response
    const likesCount = post.likes.length;
    res.json({ post, likesCount });
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Data OF POST BAtabase
export const getimage = async (req, res) => {
  try {
    const posts = await Post.find({status : "pending"}).populate("facilitator");
    // console.log(posts);
    res.json(posts); // Send the posts as JSON response
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// 
export const getactivePosts = async (req,res) => {
  try {
    const p = await Post.find({status : "active"}).populate("facilitator")
    console.log(p)
    res.json({
      message:"Data is retrive",
      success:true,
      p
    })
  } catch (error) {
    console.error("Error submitting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const grant = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { status: 'active' },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.error('Error granting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const notgrant = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { status: 'deactive' },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.error('Error not granting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const Comment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id; // Get user ID from the verified token
    const { text } = req.body; // Extract comment text from request body

    // Create a new comment object
    const newComment = {
      text: text,
      user: userId,
      createdAt: new Date(),
    };

    // Find the post by ID and update the comments array
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment } },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error("Error submitting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const time =async (req, res) => {
//   try {
//     const latestPost = await Post.findOne().sort({ createdAt: -1 });
//     res.json({ createdAt: latestPost.createdAt });
//   } catch (error) {
//     console.error('Error fetching post creation time:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
