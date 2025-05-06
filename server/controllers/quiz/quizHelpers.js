const User = require("../../models/User");

function normalizeAnswers(input) {
  if (!input) return [];
  return Array.isArray(input)
    ? input.map((a) => parseInt(a))
    : [parseInt(input)];
}

function initSession(req) {
  if (!req.session) req.session = {};
  if (!req.session.userAnswers) req.session.userAnswers = [];
}

function findLesson(course, moduleId, lessonId) {
  const module = course.modules.find((mod) => mod.id === moduleId);
  if (!module) throw new Error("Module not found");
  const lesson = module.lessons.find((les) => les.id === lessonId);
  if (!lesson) throw new Error("Lesson not found");
  return lesson;
}

function evaluateAnswers(questions, submittedAnswers) {
  let score = 0;

  questions.forEach((question, i) => {
    const correctSet = new Set((question.answerIndex || []).map(Number));
    const submittedSet = new Set((submittedAnswers[i] || []).map(Number));

    const match =
      correctSet.size === submittedSet.size &&
      [...correctSet].every((val) => submittedSet.has(val));

    console.log(`Question ${i + 1}:`);
    console.log("Expected:", [...correctSet]);
    console.log("Submitted:", [...submittedSet]);
    console.log("Match:", match);

    if (match) score++;
  });

  return {
    score,
    isAllCorrect: score === questions.length,
  };
}

async function markLessonComplete(userId, courseId, lessonId) {
  const user = await User.findById(userId);
  const progress = user.progress.find((p) => p.course.equals(courseId));
  if (progress && !progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    await user.save();
  }
}


module.exports = {
  normalizeAnswers,
  initSession,
  findLesson,
  evaluateAnswers,
  markLessonComplete,
};
