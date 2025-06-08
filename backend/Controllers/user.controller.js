const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const already = await prisma.enrollment.findFirst({
    where: { userId: req.user.id, courseId }
  });

  if (already) return res.status(400).json({ message: 'Already enrolled' });

  const enroll = await prisma.enrollment.create({
    data: { userId: req.user.id, courseId }
  });

  res.json(enroll);
};

exports.getUserCourses = async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.id },
    include: { course: true }
  });
  res.json(enrollments.map((e) => e.course));
};

exports.getCourseProgress = async (req, res) => {
  // Placeholder - can be extended with video tracking
  res.json({ courseId: req.params.courseId, completedVideos: [] });
};

exports.markVideoComplete = async (req, res) => {
  // Add to user progress tracking - optional
  res.json({ message: 'Marked as complete' });
};

exports.commentOnVideo = async (req, res) => {
  const { videoId, comment } = req.body;
  const newComment = await prisma.comment.create({
    data: { videoId, userId: req.user.id, comment }
  });
  res.json(newComment);
}

exports.getModules = async (req, res) => {
  const { courseId } = req.params;

  // Validate courseId
  if (!courseId || isNaN(parseInt(courseId))) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    const modules = await prisma.module.findMany({
      where: {
        courseId: parseInt(courseId),
      },
      include: {
        course: true,
        videos: true,
      },
    });

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};