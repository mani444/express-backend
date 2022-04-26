import express from "express";
// const express = require("express");
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const ATLAS_URI = "mongodb+srv://mani444:4045@cluster0.fbb0p.mongodb.net/users";
mongoose
  .connect(process.env.ATLAS_URI || "mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.error("NOT CNNECTED TO MONGODB", err);
  });

//user schema
const userSchema = new mongoose.Schema({
  name: String,
  //   email: String,
  //   password: String,
});

const User = mongoose.model("users", userSchema);
async function createUser() {
  const user = new User({
    name: "abdul mannan",
  });

  try {
    const result = await user.save();
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

// createUser();
app.post("/Login", async (req, res) => {
  const name = req.body;

  console.log(name);
  const user = await getUser(name);

  if (user) {
    console.log(user);

    res.send({ message: "login sucess", user: user });
  } else {
    res.send({ message: "not logged in" });
  }
});

const getUser = async (name) => {
  try {
    return await User.findOne(name);
  } catch (err) {
    console.error(err.message);
  }
};
// app.post("/Register", (req, res) => {
//   console.log(req.body);
//   const { name, email, password } = req.body;
//   User.findOne({ email: email }, (err, user) => {
//     if (user) {
//       res.send({ message: "user already exist" });
//     } else {
//       const user = new User({ name, email, password });
//       user.save((err) => {
//         if (err) {
//           res.send(err);
//         } else {
//           res.send({ message: "sucessfull" });
//         }
//       });
//     }
//   });
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
