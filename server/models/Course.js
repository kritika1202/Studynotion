const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, default: 0 }, // minutes
  videoUrl: { type: String, default: "" },
  isFree: { type: Boolean, default: false },
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lectures: [lectureSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["Web Development", "Data Science", "Mobile Development", "DevOps", "Design", "Business"],
      required: true,
    },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    price: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalStudents: { type: Number, default: 0 },
    sections: [sectionSchema],
    tags: [String],
  },
  { timestamps: true }
);

courseSchema.virtual("totalLectures").get(function () {
  if (!this.sections) return 0;
  return this.sections.reduce((sum, s) => sum + s.lectures.length, 0);
});

courseSchema.virtual("totalDuration").get(function () {
  if (!this.sections) return 0;
  return this.sections.reduce(
    (sum, s) => sum + s.lectures.reduce((lSum, l) => lSum + l.duration, 0),
    0
  );
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Course", courseSchema);
