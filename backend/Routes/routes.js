const express = require('express');
const router = express.Router();

const authController = require('../Controllers/auth.controller');
const courseController = require('../Controllers/course.controller');
const userController = require('../Controllers/user.controller');
const adminController = require('../Controllers/admin.controller');
const { authenticate } = require('../middlewares/JWT');
const isAdmin = require('../middlewares/isAdmin');

// ---------- Auth Routes ----------
router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);
router.get('/profile', authenticate, authController.getUserProfile);
router.put('/profile', authenticate, authController.updateUserProfile);

// ---------- Course Routes (User) ----------
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:courseId', courseController.getCourseById);
router.get('/modules/:courseId', userController.getModules);
// ---------- User Course Actions (Protected) ----------
router.post('/enroll', authenticate, userController.enrollInCourse);
router.get('/mycourses', authenticate, userController.getUserCourses);
router.get('/progress/:courseId', authenticate, userController.getCourseProgress);
router.post('/completeVideo', authenticate, userController.markVideoComplete);
router.post('/comment', authenticate, userController.commentOnVideo);

// ---------- Admin Routes (Protected + Admin only) ----------
router.post('/courses', authenticate, isAdmin, adminController.addCourse);
router.put('/courses/:courseId', authenticate, isAdmin, adminController.updateCourse);
router.delete('/courses/:courseId', authenticate, isAdmin, adminController.deleteCourse);
router.post('/module', authenticate, isAdmin, adminController.addModule);
router.put('/modules/:moduleId', adminController.updateModule);
router.delete('/modules/:moduleId', isAdmin, adminController.deleteModule);

router.post('/video', authenticate, isAdmin, adminController.addVideo);
router.put('/video/:videoId',  adminController.updateVideo);
router.delete('/video/:videoId',  adminController.deleteVideo);
module.exports = router;
