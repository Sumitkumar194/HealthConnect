import express from "express";
import cors from "cors"
import { Post } from "../module/PostRemedie.js";
export const router = express.Router(); 
import {test,Schema,upload1,upload,getimage,Registerkaro,loginuser,verifyToken,profile,like,Comment,Facilatorpost,getactivePosts,grant,notgrant,fetcDocter} from "../Controler/auth_controller.js";
router.use(cors(
    {
        credentials:true,
        origin:'http://localhost:5173'
    }
))
router.use(express.static('public'))

router.get("/",test);

router.get("/Schema",Schema);

router.post("/uploadPost", verifyToken, upload.single("image"),upload1);

router.get("/getPosts",getimage);

router.put('/grantPost/:postId', grant);
  
// Not grant post route
router.put('/notGrantPost/:postId', notgrant);

router.get("/getactivePosts",getactivePosts);
  
router.post("/Register",Registerkaro)

router.post("/login",loginuser)

router.get("/profile",verifyToken,profile)

router.get("/Facilatorpost",verifyToken,Facilatorpost)

router.post('/posts/:postId/like', verifyToken,like)

router.post('/posts/:postId/comment', verifyToken,Comment)

router.get("/fetcDocter",verifyToken,fetcDocter)

// router.get("/time",time)
