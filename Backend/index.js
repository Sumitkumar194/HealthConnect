import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { router } from "./Roter/auth-router.js";
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/", router);
app.use(express.static('public'));
// app.use('/public', express.static(path.join(__dirname, 'public')));
// Mongo Connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Rural_women");
  console.log("db connect kar do plese");
}

app.listen(8000, () => {
  console.log("The Route is listen");
});
