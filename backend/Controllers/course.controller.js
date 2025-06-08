const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // ✅ Add this line

exports.getAllCourses = async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: +req.params.courseId },
    include: { modules: { include: { videos: true } } }
  });
  res.json(course);
};

