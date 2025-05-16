// Modules
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String },
  },
  description: {
    en: { type: String },
    ar: { type: String },
  },

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
      title: {
        en: { type: String },
        ar: { type: String },
      },
      isDemoOnly: {
        type: Boolean,
        default: false,
      },
      lessons: [
        {
          id: String,
          title: {
            en: { type: String },
            ar: { type: String },
          },
          content: {
            en: { type: String },
            ar: { type: String },
          },
          videoUrl: {
            en: { type: String },
            ar: { type: String },
          },
          quiz: {
            questions: [
              {
                question: {
                  en: { type: String },
                  ar: { type: String },
                },
                options: [
                  {
                    en: String,
                    ar: String,
                  },
                ],
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
