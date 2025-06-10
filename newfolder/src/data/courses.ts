export interface Course {
  id: string;
  title: string;
  description: string;
  fullPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  startDate: string;
  tags: string[];
  category: 'web' | 'devops' | 'web3' | 'blockchain';
  featured: boolean;
  syllabus: string;
}

export const courses: Course[] ={}
export function getFeaturedCourses() {
  return courses.filter(course => course.featured);
}

export function getCourseById(id: string) {
  return courses.find(course => course.id === id);
}

export function getCoursesByCategory(category: string) {
  if (category === 'all') return courses;
  return courses.filter(course => course.category === category);
}