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
  try {
    const lang = req.getLocale() || "en";

    const courseId = req.params.courseId;
    const moduleId = req.params.moduleId;
    const lessonId = req.params.lessonId;
    const questionIndex = parseInt(req.query.question || 0);

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    const { localizeCourse } = require("../../utils/localizationHelpers");
    const localizedCourse = localizeCourse(course, lang);

    const localizedModule = localizedCourse.modules?.find(
      (m) => m.id === moduleId
    );
    if (!localizedModule)
      throw new Error(`Module ${moduleId} not found in localized course`);

    const localizedLesson = localizedModule.lessons?.find(
      (l) => l.id === lessonId
    );
    if (!localizedLesson)
      throw new Error(`Lesson ${lessonId} not found in module ${moduleId}`);

    const currentQuestion = localizedLesson.quiz.questions[questionIndex];

    const translations = require(`../../locales/${lang}.json`);

    res.render("quizzes/quiz", {
      title: `${localizedCourse.title} - ${localizedLesson.title}`,
      pageTitle: localizedLesson.title,
      course: localizedCourse,
      module: localizedModule,
      lesson: localizedLesson,
      currentLesson: localizedLesson,
      question: currentQuestion,
      questionIndex,
      totalQuestions: localizedLesson.quiz.questions.length,
      userAnswers: (req.session && req.session.userAnswers) || [],
      user: req.user,
      pageStyles: ["quiz.css", "sidebar.css"],
      pageScripts: ["courseSidebar.js"],
      showSidebarToggle: true,
      lang,
      translations,
    });
  } catch (err) {
    console.error("Quiz load error:", err);
    res.status(500).send("Error loading quiz.");
  }
};

// submitQuiz - Quiz submission
// submitQuiz - Quiz submission
exports.submitQuiz = async (req, res) => {
  const { courseId, moduleId, lessonId } = req.params;
  const lang = req.cookies.lang || "en";
  const translations = require(`../../locales/${lang}.json`);

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
      let progress = user.progress.find((p) => p.course.equals(courseId));

      if (progress) {
        if (!progress.completedLessons.includes(lessonId)) {
          progress.completedLessons.push(lessonId);
        }
      } else {
        user.progress.push({
          course: courseId,
          completedLessons: [lessonId],
        });
      }

      await user.save();

      // Auto-generate certificate on success
      const { createCertificatePDF } = require("../../utils/pdfGenerator");
      const existingCert = user.certificates.find(
        (c) => c.courseId.toString() === courseId.toString()
      );

      if (!existingCert) {
        const certificateId = `RSA-${user._id.toString().slice(-6)}-${Date.now()
          .toString()
          .slice(-4)}`;

        const { certPath, fileName, issuedAt } = await createCertificatePDF(
          user,
          course,
          certificateId,
          req
        );

        user.certificates.push({
          courseId,
          filePath: `/certificates/${fileName}`,
          issuedAt,
          certId: certificateId,
        });

        await user.save();
      }

      return res.redirect(`/courses/${courseId}/success`);
    }

    return res.render("quizzes/quizResult", {
      course,
      module,
      lesson,
      currentLesson: lesson,
      user: req.user,
      score,
      total: questions.length,
      title: "Quiz Failed",
      pageTitle: "Quiz Result",
      pageStyles: ["quiz.css", "sidebar.css", "quiz-result.css"],
      pageScripts: ["courseSidebar.js"],
      showSidebarToggle: true,
      translations,
      lang,
    });
  } catch (err) {
    console.error("Quiz submission failed:", err);
    res.status(500).send("Quiz failed.");
  }
};
