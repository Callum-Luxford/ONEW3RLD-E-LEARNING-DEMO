// Modules
const Course = require("../../models/Course");
const User = require("../../models/User");
const {
  normalizeAnswers,
  initSession,
  findLesson,
  evaluateAnswers,
  markLessonComplete,
} = require("./quizHelpers");

// renderQuiz - Render the quiz page
exports.renderQuiz = async (req, res) => {
  const { courseId, moduleId, lessonId } = req.params;
  const questionIndex = parseInt(req.query.q || "0", 10);

  try {
    const course = await Course.findById(courseId);
    const lesson = findLesson(course, moduleId, lessonId);
    const questions = lesson.quiz?.questions || [];

    initSession(req);

    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return res.status(404).send("Question not found.");

    res.render("quizzes/quiz", {
      title: lesson.title,
      course,
      module: course.modules.find((mod) => mod.id === moduleId),
      lesson,
      question: currentQuestion,
      questionIndex,
      totalQuestions: questions.length,
      userAnswers: req.session.userAnswers,
    });
  } catch (err) {
    console.error("Quiz load error:", err);
    res.status(500).send("Could not load quiz.");
  }
};

// submitQuiz - Quiz submission
exports.submitQuiz = async (req, res) => {
  const { courseId, moduleId, lessonId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const module = course.modules.find((m) => m.id === moduleId);
    const lesson = module.lessons.find((l) => l.id === lessonId);
    const questions = lesson.quiz.questions;

    const submitted = req.body.answers || {};
    const results = [];

    questions.forEach((q, index) => {
      const correctSet = new Set(q.answerIndex.map((i) => Number(i)));
      const submittedSet = new Set(
        (submitted[index] || []).map((i) => Number(i))
      );

      const match =
        correctSet.size === submittedSet.size &&
        [...correctSet].every((val) => submittedSet.has(val));

      results.push(match);
    });

    const score = results.filter(Boolean).length;
    const passed = score === questions.length;

    if (passed) {
      const user = await User.findById(req.user._id);
      const progress = user.progress.find((p) => p.course.equals(courseId));

      if (progress && !progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        await user.save();
      }

      return res.redirect(`/courses/${courseId}/success`);

    }

    return res.render("quizzes/quizResult", {
      course,
      module,
      lesson,
      score,
      total: questions.length,
      title: "Quiz Failed",
    });
  } catch (err) {
    console.error("Quiz submission failed:", err);
    res.status(500).send("Quiz failed.");
  }
};
