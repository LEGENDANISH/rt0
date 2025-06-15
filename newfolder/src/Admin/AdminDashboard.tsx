import React, { useState, useEffect } from 'react';
import { Users, BookOpen, DollarSign } from 'lucide-react';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
}

const AdminDashboard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses'); // Update URL if needed
        const data = Array.isArray(res.data) ? res.data : res.data.courses || [];

        // Update state with fetched data
        setTotalCourses(data.length);
        setTotalRevenue(
          data.reduce((acc: number, course: Course) => acc + course.price, 0)
        );
        setRecentCourses(data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="text-center py-4">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Courses</h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              {!recentCourses.length ? (
                <p className="text-gray-500 dark:text-gray-400 py-4">No courses found.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="text-left">
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="p-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                          {course.title}
                        </td>
                        
                        <td className="p-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                          ₹{course.price.toFixed(2)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;