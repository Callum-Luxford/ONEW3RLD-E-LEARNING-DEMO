// Modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// userSchema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  progress: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      completedLessons: [String],
      quizScores: [
        {
          moduleId: String,
          score: Number,
          passed: Boolean, // you had "passwd" – typo fixed here
        },
      ],
    },
  ],
  certificates: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      filePath: String, // e.g. '/certificates/userId-courseId.pdf'
      issuedAt: { type: Date, default: Date.now },
      certId: String, // UUID or unique hash
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Password hashing (before save)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
