const demoMode = process.env.DEMO_MODE === "true";

exports.getCourseProgress = (course, userProgressList) => {
  const courseProgress = userProgressList?.find(
    (entry) => entry.course.toString() === course._id.toString()
  );
  const completedLessons = courseProgress?.completedLessons || [];

  // DEMO MODE: Track only non-demo modules
  const modulesToCount = demoMode
    ? course.modules.filter((mod) => !mod.isDemoOnly)
    : course.modules;

  const totalLessons = modulesToCount.reduce(
    (count, mod) => count + mod.lessons.length,
    0
  );

  const completedCount = modulesToCount
    .flatMap((mod) => mod.lessons)
    .filter(
      (lesson) =>
        completedLessons.includes(lesson.id) ||
        completedLessons.includes(lesson._id?.toString())
    ).length;

  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons: completedCount,
    progressPercent,
  };
};

exports.getNextIncompleteLesson = (course, completedLessonIds = []) => {
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (!completedLessonIds.includes(lesson.id)) {
        return {
          moduleId: module.id,
          lessonId: lesson.id,
        };
      }
    }
  }
  return null;
};
