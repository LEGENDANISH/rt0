// Admin
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


exports.addCourse = async (req, res) => {
  const { title, description, thumbnail, price, originalprice } = req.body;

  const existingCourse = await prisma.course.findFirst({
  where: { title }
});
  if (existingCourse) {
    return res.status(400).json({ message: 'A course with this title already exists' });
  }

  try {
    const course = await prisma.course.create({
      data: { title, description, thumbnail, price, originalprice }
    });
    res.json(course);
  } catch (error) {
  console.error('Prisma error:', error);
  res.status(500).json({ message: 'Server error', error });
}
};

exports.updateCourse = async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  if (isNaN(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  const existing = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const { title, description, thumbnail, price, originalprice } = req.body;
  const parsedPrice = parseFloat(price);
  const parsedOriginalprice = parseFloat(originalprice);

  if (!title || !description || !thumbnail || isNaN(parsedPrice) || isNaN(parsedOriginalprice)) {
    return res.status(400).json({
      message: 'Missing or invalid required fields',
      required: ['title', 'description', 'thumbnail', 'price', 'originalprice'],
    });
  }

  try {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        thumbnail,
        price: parsedPrice,
        originalprice: parsedOriginalprice,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  if (isNaN(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: { videos: true }
        }
      }
    });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await prisma.$transaction(async (prisma) => {
      for (const module of existingCourse.modules) {
        if (module.videos.length > 0) {
          await prisma.video.deleteMany({
            where: { moduleId: module.id }
          });
        }
      }

      await prisma.module.deleteMany({
        where: { courseId }
      });

      await prisma.course.delete({
        where: { id: courseId }
      });
    });

    res.json({ 
      message: 'Course and all related content deleted successfully',
      deletedCourse: existingCourse.title || `Course ID: ${courseId}`
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User

exports.getUserCourses = async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.id },
    include: { course: true }
  });
  res.json(enrollments.map(e => e.course));
};

exports.getAllCourses = async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json(courses);
};
exports.getCourseById = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            videos: true
          }
        },
        enrollments: true // 👈 This includes all enrollments for the course
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};
exports.getCourseEnrollmentStats = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate courseId
    const courseIdNum = parseInt(courseId);
    if (isNaN(courseIdNum)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Fetch course with enrollment count
    const course = await prisma.course.findUnique({
      where: { id: courseIdNum },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Return success response
    return res.status(200).json({
      courseId: course.id,
      title: course.title,
      enrollmentCount: course._count.enrollments
    });

  } catch (error) {
    console.error('Error getting course enrollment stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get enrollment statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};