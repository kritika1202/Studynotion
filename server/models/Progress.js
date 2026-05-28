const mongoose = require("mongoose");

const lectureProgressSchema = new mongoose.Schema({
  lectureId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completedAt: { type: Date, default: Date.now },
});

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLectures: [lectureProgressSchema],
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

progressSchema.methods.getPercentage = function (totalLectures) {
  if (!totalLectures) return 0;
  return Math.round((this.completedLectures.length / totalLectures) * 100);
};

module.exports = mongoose.model("Progress", progressSchema);
