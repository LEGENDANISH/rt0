// Admin
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.addVideo = async (req, res) => {
  const { title, url, moduleId, thumbnail } = req.body;

  const moduleExists = await prisma.module.findUnique({
    where: { id: moduleId }
  });

  if (!moduleExists) {
    return res.status(400).json({ error: "Invalid moduleId. Module not found." });
  }

  const video = await prisma.video.create({
    data: { title, url, moduleId, thumbnail }
  });

  res.json(video);
};

exports.updateVideo = async (req, res) => {
  const { videoId } = req.params;
  const { title, url, thumbnail } = req.body;

  if (!videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  if (!title && !url && !thumbnail) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  try {
    const updatedVideo = await prisma.video.update({
      where: { id: parseInt(videoId) },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(thumbnail && { thumbnail }),
      },
    });

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteVideo = async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    await prisma.video.delete({
      where: { id: parseInt(videoId) },
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.markVideoComplete = async (req, res) => {
  // Add to user progress tracking - optional
  res.json({ message: 'Marked as complete' });
};