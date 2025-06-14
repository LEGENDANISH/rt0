import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './Users/HomePage';
import CoursesPage from './Users/CoursesPage';
import CourseDetailPage from './Users/CourseDetailPage';

import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import CourseManager from './Admin/Courses/CourseManager';
import { ThemeProvider } from './context/ThemeContext';
import MyCoursesPage from './Users/MyCoursesPage';
import CourseModulePage from './Users/CourseModulePage';
import VideoPlayer from './Users/VideoPlayer';
import ModuleManager from './Admin/Modules/ModuleManager';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Main site routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="my-courses" element={<MyCoursesPage />} />
            <Route path="my-courses/modules/:courseId" element={<CourseModulePage />} />
            <Route path="my-courses/:courseId/video/:videoId" element={<VideoPlayer />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
             <Route path="modules/:courseId" element={<ModuleManager />} />
            <Route path="courses" element={<CourseManager />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;