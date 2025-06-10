const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addCourse = async (req, res) => {
  const { title, description, thumbnail,price,originalprice} = req.body;
  console.log(req.body);
  const course = await prisma.course.create({
    data: { title, description, thumbnail,price,originalprice }
  });
  res.json(course);
};  


exports.updateCourse = async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  // Validate ID
  if (isNaN(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  // Check if course exists
  const existing = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Define allowed fields to update
  const { title, description, thumbnail, price,originalprice } = req.body;
  const parsedPrice = parseFloat(price);
  const parsedoriginalprice = parseFloat(originalprice);
console.log(req.body);
  // Optional: Validate required fields
  if (!title || !description || !thumbnail || isNaN(parseFloat(price)) || isNaN(parseFloat(originalprice))) {
    return res.status(400).json({
      message: 'Missing or invalid required fields',
      required: ['title', 'description', 'thumbnail', 'price','originalprice'],
    });
  }

  try {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        thumbnail,
        price:parsedPrice,
        originalprice:parsedoriginalprice ,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  // Validate ID
  if (isNaN(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            videos: true
          }
        }
      }
    });

    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Use transaction to ensure all deletes succeed or fail together
    await prisma.$transaction(async (prisma) => {
      // Step 1: Delete all videos from all modules in this course
      for (const module of existingCourse.modules) {
        if (module.videos.length > 0) {
          await prisma.video.deleteMany({
            where: {
              moduleId: module.id
            }
          });
        }
      }

      // Step 2: Delete all modules in this course
      await prisma.module.deleteMany({
        where: {
          courseId: courseId
        }
      });

      // Step 3: Delete the course
      await prisma.course.delete({
        where: { id: courseId }
      });
    });

    res.json({ 
      message: 'Course and all related content deleted successfully',
      deletedCourse: existingCourse.title || `Course ID: ${courseId}`
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

exports.addModule = async (req, res) => {
  const { title, courseId } = req.body;

  // Validate inputs
  if (!title || !courseId || isNaN(parseInt(courseId))) {
    return res.status(400).json({ error: "Missing or invalid 'courseId'" });
  }

  try {
    const parsedCourseId = parseInt(courseId);

    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: {
        id: parsedCourseId,
      },
    });

    if (!courseExists) {
      return res.status(400).json({ error: "Invalid courseId. Course not found." });
    }

    // Create module
    const newModule = await prisma.module.create({
      data: {
        title,
        courseId: parsedCourseId,
      },
    });

    return res.json(newModule);
  } catch (error) {
    console.error("Error adding module:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const { title } = req.body;

  // Validate input
  if (!moduleId || isNaN(parseInt(moduleId))) {
    return res.status(400).json({ error: 'Invalid module ID' });
  }

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Module title is required' });
  }

  try {
    const updatedModule = await prisma.module.update({
      where: {
        id: parseInt(moduleId),
      },
      data: {
        title,
      },
    });

    res.json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

exports.deleteModule = async (req, res) => {
  const { moduleId } = req.params;

  if (!moduleId || isNaN(parseInt(moduleId))) {
    return res.status(400).json({ error: 'Invalid module ID' });
  }

  try {
    // Check if module exists and get its videos
    const existingModule = await prisma.module.findUnique({
      where: { id: parseInt(moduleId) },
      include: {
        videos: true
      }
    });

    if (!existingModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Use transaction to delete module and its videos
    await prisma.$transaction(async (prisma) => {
      // Step 1: Delete all videos in this module
      if (existingModule.videos.length > 0) {
        await prisma.video.deleteMany({
          where: {
            moduleId: parseInt(moduleId)
          }
        });
      }

      // Step 2: Delete the module
      await prisma.module.delete({
        where: {
          id: parseInt(moduleId)
        }
      });
    });

    res.json({ 
      message: 'Module and all related videos deleted successfully',
      deletedModule: existingModule.title || `Module ID: ${moduleId}`,
      deletedVideosCount: existingModule.videos.length
    });

  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ 
      error: 'Failed to delete module',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

exports.addVideo = async (req, res) => {
  const { title, url, moduleId, thumbnail } = req.body;

  // Check if module exists
  const moduleExists = await prisma.module.findUnique({
    where: { id: moduleId }
  });

  if (!moduleExists) {
    return res.status(400).json({ error: "Invalid moduleId. Module not found." });
  }

  // Create video
  const video = await prisma.video.create({
    data: { title, url, moduleId, thumbnail }
  });

  res.json(video);
};

exports.updateVideo = async (req, res) => {
console.log(req.params)
  const { videoId } = req.params;
  const { title, url, thumbnail } = req.body;

  // Validate input
  if (!videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  if (!title && !url && !thumbnail) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  try {
    const updatedVideo = await prisma.video.update({
      where: {
        id: parseInt(videoId),
      },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(thumbnail && { thumbnail }),
      },
    });

    res.json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// DELETE /api/video/:videoId
exports.deleteVideo = async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    await prisma.video.delete({
      where: {
        id: parseInt(videoId),
      },
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);

    // Handle case when video doesn't exist
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCommentsByVideoId = async (req, res) => {
  const { videoId } = req.params;

  // Validate videoId
  if (!videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ message: 'Invalid video ID' });
  }

  try {
    // Fetch comments with associated user info
    const comments = await prisma.comment.findMany({
      where: {
        videoId: parseInt(videoId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to load comments' });
  }
};