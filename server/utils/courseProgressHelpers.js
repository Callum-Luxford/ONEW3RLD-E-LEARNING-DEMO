exports.getCourseProgress = (course, userProgressList) => {
  const totalLessons = course.modules.reduce(
    (count, mod) => count + mod.lessons.length,
    0
  );

  const courseProgress = userProgressList?.find(
    entry => entry.course.toString() === course._id.toString()
  );

  const completedLessons = courseProgress?.completedLessons || [];

  const completedCount = completedLessons.filter(lessonId =>
    course.modules.some(mod =>
      mod.lessons.some(les =>
        les.id === lessonId || les._id?.toString() === lessonId.toString()
      )
    )
  ).length;

  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons: completedCount,
    progressPercent
  };
};
