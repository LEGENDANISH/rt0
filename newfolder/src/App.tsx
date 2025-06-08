import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';
import { ThemeProvider } from './context/ThemeContext';
import MyCoursesPage from './pages/MyCoursesPage';
import CourseModulePage from './pages/CourseModulePage';
import VideoPlayer from './pages/VideoPlayer';
import ModuleManager from './pages/admin/ModuleManager';

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
            <Route path="my-courses/:courseId" element={<CourseModulePage />} />
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