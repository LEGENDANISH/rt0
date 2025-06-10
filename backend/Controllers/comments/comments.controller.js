// Admin
// (Assuming these are admin or user actions depending on your auth setup)

exports.commentOnVideo = async (req, res) => {
  const { videoId, comment } = req.body;
  const userId = req.user.id;

  if (!comment || !videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        comment,
        userId,
        videoId: parseInt(videoId),
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// User

exports.getCommentsByVideoId = async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || isNaN(parseInt(videoId))) {
    return res.status(400).json({ message: 'Invalid video ID' });
  }

  try {
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
    res.status(500).json({ message: 'Failed to load comments' });
  }
};