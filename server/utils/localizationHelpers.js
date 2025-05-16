function localizeCourse(course, lang = "en") {
  const courseObj = course.toObject?.() || course;

  const localizedModules = courseObj.modules.map((module) => ({
    ...module,
    title: module.title?.[lang] || module.title?.en || module.title,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      title: lesson.title?.[lang] || lesson.title?.en || lesson.title,
      content: lesson.content?.[lang] || lesson.content?.en || lesson.content,
      // Localize videoUrl field
      videoUrl:
        typeof lesson.videoUrl === "object"
          ? lesson.videoUrl?.[lang] || lesson.videoUrl?.en || ""
          : lesson.videoUrl || "",
      quiz: lesson.quiz
        ? {
            ...lesson.quiz,
            questions: lesson.quiz.questions.map((q) => ({
              ...q,
              question: q.question?.[lang] || q.question?.en || q.question,
              options: q.options.map((opt) => opt?.[lang] || opt?.en || opt),
            })),
          }
        : undefined,
    })),
  }));

  return {
    ...courseObj,
    title: courseObj.title?.[lang] || courseObj.title?.en || courseObj.title,
    subtitle:
      courseObj.subtitle?.[lang] ||
      courseObj.subtitle?.en ||
      courseObj.subtitle,
    summary:
      courseObj.summary?.[lang] || courseObj.summary?.en || courseObj.summary,
    modules: localizedModules,
  };
}

module.exports = {
  localizeCourse,
};
