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

// exports.commentOnVideo = async (req, res) => {
//   const { videoId, comment } = req.body;
//   const newComment = await prisma.comment.create({
//     data: { videoId, userId: req.user.id, comment }
//   });
//   res.json(newComment);
// }
exports.getModules = async (req, res) => {
  const { courseId } = req.params;

  console.log('Received courseId:', courseId); // Log input

  // Validate courseId
  if (!courseId || isNaN(parseInt(courseId))) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    const numericCourseId = parseInt(courseId);

    const modules = await prisma.module.findMany({
      where: {
        courseId: numericCourseId,
      },
      include: {
        videos: true,
      },
    });

    console.log(`Found ${modules.length} modules for course ID ${numericCourseId}`); // Confirm result

    if (modules.length === 0) {
      return res.json([]); // Return empty array instead of error
    }

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error.message || error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.commentOnVideo = async (req, res) => {
     const { videoId, comment } = req.body;
 // ✅ Must include "comment" field
  const userId = req.user.id;

  if (!comment || !videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        comment,       // ✅ From request body
        userId,        // ✅ From authenticated user
        videoId: parseInt(videoId), // ✅ From URL param
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};