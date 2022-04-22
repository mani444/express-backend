const config = require("config");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const authenticator = require("./authenticator");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => {
    console.log("CONNECTED TO MongoDB...");
  })
  .catch((err) => {
    console.error("NOT CNNECTED TO MONGODB", err);
  });

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /regexpattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["vue", "backend", "frontend"],
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: async function (v) {
        return await verifier(v);
      },
      message: "No tags entered",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
  },
});
const Course = mongoose.model("Course", courseSchema);

function verifier(v) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(v && v.length > 0);
    }, 2000);
  });
}
async function createCourse() {
  const course = new Course({
    name: "Express.js asfad",
    category: "backend",
    author: "MOSHasas",
    tags: ["hhh", "kkk"],
    isPublished: true,
    price: 15,
  });
  // This cat has no name :(
  // course.save(function (error) {

  //   error = course.validateSync();
  //   console.error(error.message);

  // });
  try {
    // await course.validate((err) => {
    //   if (err) console.log(err.message);
    // });
    const result = await course.save();
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

createCourse();

const getCourses = async () => {
  const courses = await Course.find({ author: "AM", isPublished: true })
    .limit(1)
    .sort({ name: -1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
};

//get

// query first
const updateCourses = async (id) => {
  console.log(id);

  const course = await Course.findById(id);
  if (!course) return;

  course.name = ".nET MVC";
  course.isPublished = false;
  const result = await course.save();
  console.log(result);
  // console.log(course);
};

//updateCourses("624fdaadc9256ebda8ee3914");

//Update first
const updateCourses2 = async (id) => {
  // const course = await Course.updateOne(
  //   { _id: id },
  //   {
  //     $set: {
  //       name: ".nET MVC 123123",
  //       isPublished: true,
  //     },
  //   }
  // );

  // const course = await Course.findByIdAndUpdate(
  //   id,
  //   {
  //     $set: {
  //       name: "ASPNET",
  //       isPublished: false,
  //       author: "mamama",
  //     },
  //   },
  //   { new: true }
  // );

  const course = await Course.findOneAndUpdate(
    { isPublished: true, author: "jfjdj" },
    {
      $set: {
        name: "Kaha MVC .net",
        isPublished: true,
        author: "Jamil",
      },
    },
    { new: true }
  );
  console.log(course);
};

//updateCourses2("624fdaadc9256ebda8ee3914");
const deleteCourses = async (id) => {
  const course = await Course.deleteOne({ _id: id });

  console.log(course);
};

//deleteCourses("624fdae32f4e6c5c7df2a8e0");
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.static("public"));

app.use("/courses", courses);
app.use("/", home);

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
//console.log("Mail Password: " + config.get("mail.password"));

// app.use(morgan("short"));
console.log(`Node ENV: ${process.env.NODE_ENV}`);
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log(app.get("env"), "server");
}

app.use(logger);
app.use(authenticator);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
