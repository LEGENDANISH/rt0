// Admin
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.addModule = async (req, res) => {
  const { title, courseId } = req.body;

  if (!title || !courseId || isNaN(parseInt(courseId))) {
    return res.status(400).json({ error: "Missing or invalid 'courseId'" });
  }

  try {
    const parsedCourseId = parseInt(courseId);

    const courseExists = await prisma.course.findUnique({
      where: { id: parsedCourseId },
    });

    if (!courseExists) {
      return res.status(400).json({ error: "Invalid courseId. Course not found." });
    }

    const newModule = await prisma.module.create({
      data: { title, courseId: parsedCourseId },
    });

    return res.json(newModule);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const { title } = req.body;

  if (!moduleId || isNaN(parseInt(moduleId))) {
    return res.status(400).json({ error: 'Invalid module ID' });
  }

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Module title is required' });
  }

  try {
    const updatedModule = await prisma.module.update({
      where: { id: parseInt(moduleId) },
      data: { title },
    });

    res.json(updatedModule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update module' });
  }
};

exports.deleteModule = async (req, res) => {
  const { moduleId } = req.params;

  if (!moduleId || isNaN(parseInt(moduleId))) {
    return res.status(400).json({ error: 'Invalid module ID' });
  }

  try {
    const existingModule = await prisma.module.findUnique({
      where: { id: parseInt(moduleId) },
      include: { videos: true }
    });

    if (!existingModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await prisma.$transaction(async (prisma) => {
      if (existingModule.videos.length > 0) {
        await prisma.video.deleteMany({
          where: { moduleId: parseInt(moduleId) }
        });
      }

      await prisma.module.delete({
        where: { id: parseInt(moduleId) }
      });
    });

    res.json({ 
      message: 'Module and all related videos deleted successfully',
      deletedModule: existingModule.title || `Module ID: ${moduleId}`,
      deletedVideosCount: existingModule.videos.length
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete module'
    });
  }
};


// User

exports.getModules = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId || isNaN(parseInt(courseId))) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    const numericCourseId = parseInt(courseId);

    const modules = await prisma.module.findMany({
      where: { courseId: numericCourseId },
      include: { videos: true },
    });

    if (modules.length === 0) {
      return res.json([]); // Return empty array for no modules
    }

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};