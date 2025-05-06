// Modules
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  // Success message content (optional but scalable)
  successMessage: {
    heading: { type: String, default: "Congratulations {{name}}!" },
    body: {
      type: String,
      default: "You've successfully completed the course.",
    },
    downloadLabel: { type: String, default: "Download Your Certificate" },
  },

  modules: [
    {
      id: String,
      title: String,
      lessons: [
        {
          id: String,
          title: String,
          content: String,
          videoUrl: String,
          quiz: {
            questions: [
              {
                question: String,
                options: [String],
                answerIndex: [Number],
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
