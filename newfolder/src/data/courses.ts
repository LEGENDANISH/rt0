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

export const courses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development + Devops + Blockchain Cohort',
    description: 'Master web development, DevOps practices, and blockchain technology in this comprehensive course.',
    fullPrice: 8499,
    discountedPrice: 5989,
    discountPercentage: 29.53,
    image: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    startDate: '2nd August 2024',
    tags: ['Web Development', 'DevOps', 'Blockchain', 'Projects'],
    category: 'web',
    featured: true,
    syllabus: 'https://blog.100xdevs.com/'
  },
  {
    id: '2',
    title: 'Complete Web development + Devops Cohort',
    description: 'Learn modern web development and DevOps in this comprehensive cohort program.',
    fullPrice: 5999,
    discountedPrice: 4989,
    discountPercentage: 16.84,
    image: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    startDate: '2nd August 2024',
    tags: ['Web Development', 'DevOps', 'Projects'],
    category: 'web',
    featured: false,
    syllabus: 'https://blog.100xdevs.com/'
  },
  {
    id: '3',
    title: 'Complete Web3/Blockchain Cohort',
    description: 'Dive into the world of Web3, blockchain technology, and smart contracts.',
    fullPrice: 5999,
    discountedPrice: 4989,
    discountPercentage: 16.84,
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    startDate: '2nd August 2024',
    tags: ['Web3', 'Blockchain', 'Smart Contracts', 'Projects'],
    category: 'blockchain',
    featured: false,
    syllabus: 'https://blog.100xdevs.com/'
  },
  {
    id: '4',
    title: 'Frontend Development Masterclass',
    description: 'Master modern frontend development with React, TypeScript, and more.',
    fullPrice: 4999,
    discountedPrice: 3989,
    discountPercentage: 20.2,
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    startDate: '15th August 2024',
    tags: ['Frontend', 'React', 'TypeScript'],
    category: 'web',
    featured: true,
    syllabus: 'https://blog.100xdevs.com/'
  },
  {
    id: '5',
    title: 'Backend Engineering with Node.js',
    description: 'Build scalable backends with Node.js, Express, and MongoDB.',
    fullPrice: 4999,
    discountedPrice: 3989,
    discountPercentage: 20.2,
    image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    startDate: '20th August 2024',
    tags: ['Backend', 'Node.js', 'Express', 'MongoDB'],
    category: 'web',
    featured: false,
    syllabus: 'https://blog.100xdevs.com/'
  },
  {
    id: '6',
    title: 'Smart Contract Development',
    description: 'Learn to create and deploy secure smart contracts on Ethereum and other blockchains.',
    fullPrice: 6999,
    discountedPrice: 5499,
    discountPercentage: 21.43,
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    startDate: '1st September 2024',
    tags: ['Smart Contracts', 'Solidity', 'Ethereum'],
    category: 'blockchain',
    featured: true,
    syllabus: 'https://blog.100xdevs.com/'
  }
];

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