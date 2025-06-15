export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalprice: number;
  thumbnail: string;
  syllabus: string;
  tags?: string[];
}

export interface FormData {
  title: string;
  description: string;
  
  price: number;
  originalprice: number;
  thumbnail: string;
  
  
}