// Modules
const mongoose = require("mongoose");

// courseSchema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  modules: [
    {
      id: String, // module ID (used in URLs)
      title: String,
      lessons: [
        {
          id: String, // lesson ID (used in URLs)
          title: String,
          content: String,
          videoUrl: String,
          quiz: {
            questions: [
              {
                question: String,
                options: [String],
                answerIndex: Number,
              },
            ],
          },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
