const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../Controllers/auth.controller');
const coursesController = require('../Controllers/courses/courses.controller');
const moduleController = require('../Controllers/Modules/module.controller');
const videoController = require('../Controllers/Videos/video.controller');
const commentController = require('../Controllers/comments/comments.controller');

// Middlewares
const { authenticate } = require('../middlewares/JWT');
const isAdmin = require('../middlewares/isAdmin');

// ----------
// 🟦 Auth Routes
// ----------

router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);
router.get('/profile', authenticate, authController.getUserProfile);
router.put('/profile', authenticate, authController.updateUserProfile);

// ----------
// 🟨 User Course Routes (Public or Authenticated)
// ----------

router.get('/courses', coursesController.getAllCourses);
router.get('/courses/:courseId', coursesController.getCourseById); // Public

// Authenticated user actions
router.post('/enroll', authenticate, coursesController.enrollInCourse);
router.get('/mycourses', authenticate, coursesController.getUserCourses);

// Module & Video Routes
router.get('/modules/:courseId', moduleController.getModules); // Public
router.get('/video/:videoId', commentController.getCommentsByVideoId); // Public

// Comment Route (Authenticated User)
router.post('/comment', authenticate, commentController.commentOnVideo);

// ----------
// 🔐 Admin Routes (Protected + Admin Only)
// ----------

// Course Management
router.post('/courses', authenticate, isAdmin, coursesController.addCourse);
router.put('/courses/:courseId', authenticate, isAdmin, coursesController.updateCourse);
router.delete('/courses/:courseId', authenticate, isAdmin, coursesController.deleteCourse);

// Module Management
router.post('/module', authenticate, isAdmin, moduleController.addModule);
router.put('/modules/:moduleId', authenticate, isAdmin, moduleController.updateModule);
router.delete('/modules/:moduleId', authenticate, isAdmin, moduleController.deleteModule);

// Video Management
router.post('/video', authenticate, isAdmin, videoController.addVideo);
router.put('/video/:videoId', authenticate, isAdmin, videoController.updateVideo);
router.delete('/video/:videoId', authenticate, isAdmin, videoController.deleteVideo);

module.exports = router;