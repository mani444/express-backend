const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => {
    console.log("CONNECTED TO MongoDB...");
  })
  .catch((err) => {
    console.error("NOT CoNNECTED TO MONGODB", err);
  });

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});
const Course = mongoose.model("Course", courseSchema);

const getCourses = async () => {
  const courses = await Course.find({ isPublished: true, tags: "backend" })
    // .limit(10)
    .sort({ name: 1 })
    // .count();
    .select({ name: 1, author: 1 });
  console.log(courses);
};

// getCourses();

const getCourses2 = async () => {
  const courses = await Course.find({
    isPublished: true,
    tags: { $in: ["backend", "frontend"] },
  })
    // .limit(10)
    .sort("-price")
    // .count();
    .select({ name: 1, author: 1, price: 1 });
  console.log(courses);
};

// getCourses2();

const getCourses3 = async () => {
  const courses = await Course.find({ isPublished: true })
    .or([{ tags: "backend" }, { tags: "frontend" }])

    // .limit(10)
    .sort("-price")
    // .count();
    .select({ name: 1, author: 1, price: 1 });
  console.log(courses);
};

// getCourses3();

const getCourses4 = async () => {
  const courses = await Course.find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])

    // .limit(10)
    .sort("-price")
    // .count();
    .select({ name: 1, author: 1, price: 1 });
  console.log(courses);
};

getCourses4();
