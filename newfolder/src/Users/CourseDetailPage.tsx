import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Check } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  originalprice: number;
  discountPercentage: number;
  syllabus?: string;
  startDate?: string;
  tags?: string[];
}

interface EnrollmentResponse {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const API_URL = `http://localhost:5000/api/courses`;

  // Fetch course from backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCourse(res.data);
        console.log('Course data:', res.data);
      } catch (err: any) {
        console.error('Error fetching course:', err.response?.data?.message || err.message);
        setError('Course not found');
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, token]);

  // Handle course enrollment
  const handleBuy = async () => {
    if (!token) {
      setEnrollmentMessage('Please sign in to enroll in courses');
      return;
    }

    if (!course) {
      setEnrollmentMessage('Course data not available');
      return;
    }

    try {
      setEnrollmentLoading(true);
      setEnrollmentMessage(null);

      const response = await axios.post(
        'http://localhost:5000/api/enroll',
        { courseId: course.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const enrollment: EnrollmentResponse = response.data;
      setEnrollmentMessage('Successfully enrolled in the course!');
      console.log('Enrollment successful:', enrollment);

    } catch (error: any) {
      console.error('Enrollment error:', error);
      
      let errorMessage = 'Failed to enroll in course';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please sign in to enroll in courses';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Already enrolled in this course';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setEnrollmentMessage(errorMessage);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading course details...</p>
      </div>
    );
  }

  // Show error state
  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
        <p className="text-gray-600 mb-8">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  // Format date
  const formattedStartDate = course.startDate
    ? new Date(course.startDate).toLocaleDateString()
    : 'To be announced';

  // Currency conversion
  const exchangeRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
  };

  const convertedDiscountedPrice = (
    course.price * exchangeRates[selectedCurrency as keyof typeof exchangeRates]
  ).toFixed(2);

  const convertedFullPrice = (
    course.originalprice * exchangeRates[selectedCurrency as keyof typeof exchangeRates]
  ).toFixed(2);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-blue-100 mb-6">
                {course.description}
              </p>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {course.startDate && (
                <div className="text-blue-100 text-base">
                  <span className="font-semibold">Starts </span>
                  {formattedStartDate}
                </div>
              )}
            </div>

            {/* Pricing Card */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2">PRICE</h3>
                    <div className="flex items-baseline flex-wrap gap-2">
                      <span className="text-3xl font-extrabold text-gray-900">
                        {selectedCurrency === 'INR' ? '₹' : selectedCurrency} {convertedDiscountedPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {selectedCurrency === 'INR' ? '₹' : selectedCurrency} {convertedFullPrice}
                      </span>
                      <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {course.discountPercentage}% off
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Currency:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="block w-full p-3 border border-gray-300 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  {enrollmentMessage && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${
                      enrollmentMessage.includes('Success') || enrollmentMessage.includes('enrolled')
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {enrollmentMessage.includes('Success') && (
                        <Check className="inline w-4 h-4 mr-1" />
                      )}
                      {enrollmentMessage}
                    </div>
                  )}

                  <button
                    onClick={handleBuy}
                    disabled={enrollmentLoading}
                    className={`w-full py-3 px-4 rounded-full font-medium transition-colors duration-200 mb-3 text-base ${
                      enrollmentLoading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {enrollmentLoading ? 'Processing...' : 'Buy Now'}
                  </button>

                  <button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 px-4 rounded-full font-medium transition-colors duration-200 text-base">
                    Pay via Crypto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <a
              href="#overview"
              className="py-4 px-1 border-b-2 border-blue-500 font-medium text-blue-600"
            >
              Overview
            </a>
            <a
              href="#syllabus"
              className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Syllabus
            </a>
            <a
              href="#faq"
              className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              FAQ
            </a>
          </nav>
        </div>

        <div id="overview" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {course.description}
            </p>
            {course.syllabus && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete syllabus - https://blog.100xdevs.com/</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {course.syllabus}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;