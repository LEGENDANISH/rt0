import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../data/courses';
import { ChevronDown, Check } from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = getCourseById(id || '');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
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

  return (
    <div>
      <div className="bg-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {course.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-800 text-blue-100 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">PRICE</h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">₹{course.discountedPrice.toLocaleString()}</span>
                      <span className="ml-2 text-lg text-gray-500 line-through">₹{course.fullPrice.toLocaleString()}</span>
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-medium">
                        {course.discountPercentage}% off
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Currency:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="block w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 mb-3">
                    Buy Now
                  </button>
                  
                  <button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                    Pay via Crypto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <a href="#overview" className="py-4 px-1 border-b-2 border-blue-500 font-medium text-blue-600">
              Overview
            </a>
            <a href="#syllabus" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Syllabus
            </a>
            <a href="#faq" className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              FAQ
            </a>
          </nav>
        </div>
        
        <div id="overview" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Complete syllabus – <a href={course.syllabus} className="text-blue-600 hover:text-blue-800">{course.syllabus}</a>
            </p>
            
            <p className="text-lg font-semibold">Starts {course.startDate}</p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold text-green-800 bg-green-100 inline-block px-2 py-1 rounded mb-4">FRONTEND</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Pure frontend TODO app using DOM</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>React fundamentals and advanced patterns</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Building responsive UIs with Tailwind CSS</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 bg-blue-100 inline-block px-2 py-1 rounded mb-4">FULLSTACK</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Excalidraw clone with real-time collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Build a chat app with WebSockets</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Authentication and authorization</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 bg-purple-100 inline-block px-2 py-1 rounded mb-4">WEB3 BASIC</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Create a client side wallet in JS, supporting multiple chains</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Smart contract development with Solidity</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Building DApps with React and Ethers.js</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;