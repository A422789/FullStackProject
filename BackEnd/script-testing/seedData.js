// ==========================================
// Neoteric — Static Seed Data
// Extracted from Frontend HTML files
// To be used for database seeding later
// ==========================================

// ==========================================
// 1. SERVICES (from dashboard-services.html + Services..html)
// ==========================================
const services = [
  {
    title: 'Graphic Design',
    description: 'We create stunning visual designs that communicate your brand message effectively and leave a lasting impression.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$100–500',
    category: 'Design',
  },
  {
    title: 'Motion Graphic Design',
    description: 'Engaging motion graphics and animations that bring your ideas to life, perfect for social media and marketing.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$300–1200',
    category: 'Design',
  },
  {
    title: 'Web Development',
    description: 'Professional, responsive websites built with the latest technologies, optimized for performance and SEO.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$500–2000',
    category: 'Development',
  },
  {
    title: 'Brand Identity',
    description: 'Complete brand identity solutions including logos, typography and visual systems.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$400–1500',
    category: 'Design',
  },
  {
    title: 'Logo Design',
    description: 'Creative and memorable logo designs that capture the essence of your brand.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$200–800',
    category: 'Design',
  },
  {
    title: 'UX/UI Design',
    description: 'User-centered interface designs that combine aesthetics with functionality and usability.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$200–800',
    category: 'Design',
  },
  {
    title: 'Digital Marketing',
    description: 'SEO & social media marketing strategies to grow your online presence.',
    icon: 'fa-solid fa-check',
    status: 'inactive',
    priceRange: '$200–600',
    category: 'Marketing',
  },
  {
    title: 'Mobile Development',
    description: 'iOS & Android apps built with modern frameworks for seamless mobile experiences.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$800–3000',
    category: 'Development',
  },
  {
    title: 'Content Writing',
    description: 'Blog & copywriting services that engage your audience and boost SEO rankings.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$100–400',
    category: 'Marketing',
  },
  {
    title: 'Print Design',
    description: 'High-quality print design for brochures, flyers, business cards and more.',
    icon: 'fa-solid fa-check',
    status: 'active',
    priceRange: '$150–600',
    category: 'Design',
  },
];

// ==========================================
// 2. PROJECTS (from dashboard-projects.html)
// ==========================================
const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full e-commerce web platform for RetailCo.',
    category: 'Web Design',
    deadline: '2026-06-30',
    clientName: 'RetailCo',
  },
  {
    title: 'Brand Identity Kit',
    description: 'Complete branding package for StartupX.',
    category: 'Branding',
    deadline: '2026-05-15',
    clientName: 'StartupX',
  },
  {
    title: 'Motion Intro Video',
    description: 'Animated intro video for MediaHub.',
    category: 'Motion',
    deadline: '2026-07-01',
    clientName: 'MediaHub',
  },
  {
    title: 'Portfolio Website',
    description: 'Personal portfolio website for DesignerPro.',
    category: 'Web Design',
    deadline: '2026-04-20',
    clientName: 'DesignerPro',
  },
  {
    title: 'Social Media Pack',
    description: 'Social media design package for FoodBrand.',
    category: 'Design',
    deadline: '2026-03-10',
    clientName: 'FoodBrand',
  },
  {
    title: 'Product Landing Page',
    description: 'High-converting landing page for TechCorp.',
    category: 'Web Design',
    deadline: '2026-08-01',
    clientName: 'TechCorp',
  },
];

// ==========================================
// 3. TEAM MEMBERS (from dashboard-team.html + Team.html)
// ==========================================
const teamMembers = [
  {
    fullName: 'Karam Abu Daqan',
    role: 'Motion Graphic Designer',
    email: 'karam@gmail.com',
    phone: '+972 598273728',
    department: 'Design',
    skills: ['After Effects', 'Premiere', 'Motion'],
  },
  {
    fullName: 'Aisha Dalul',
    role: 'Graphic Designer',
    email: 'aisha@gmail.com',
    phone: '+972 598273728',
    department: 'Design',
    skills: ['Figma', 'Illustrator', 'Photoshop'],
  },
  {
    fullName: 'Thekra Hammouda',
    role: 'Graphic Designer',
    email: 'thekra@gmail.com',
    phone: '+972 598273728',
    department: 'Design',
    skills: ['Figma', 'Branding', 'Typography'],
  },
  {
    fullName: 'Aya Abu Zaid',
    role: 'Graphic Designer',
    email: 'aya@gmail.com',
    phone: '+972 598273728',
    department: 'Design',
    skills: ['Photoshop', 'Figma'],
  },
  {
    fullName: 'Lama Salha',
    role: 'UXUI Designer',
    email: 'lama@gmail.com',
    phone: '+972 598273728',
    department: 'Design',
    skills: ['Figma', 'Research', 'Prototyping'],
  },
  {
    fullName: 'Deema Al Shorbasy',
    role: 'Frontend Developer',
    email: 'deema@gmail.com',
    phone: '+972 598273728',
    department: 'Development',
    skills: ['React', 'CSS', 'JavaScript'],
  },
  {
    fullName: 'Mohammed Al Haytham',
    role: 'Frontend Developer',
    email: 'mohammed@gmail.com',
    phone: '+972 598273728',
    department: 'Development',
    skills: ['Vue', 'Tailwind', 'TypeScript'],
  },
  {
    fullName: 'Akram Al Salout',
    role: 'Backend Developer',
    email: 'akram@gmail.com',
    phone: '+972 598273728',
    department: 'Development',
    skills: ['Node.js', 'PostgreSQL'],
  },
  {
    fullName: 'Amjad Sabbah',
    role: 'Backend Developer',
    email: 'amjad@gmail.com',
    phone: '+972 598273728',
    department: 'Development',
    skills: ['Python', 'Django', 'REST API'],
  },
];

// ==========================================
// 4. BLOG POSTS (from dashboard-blog.html + Blog.html)
// ==========================================
const blogs = [
  {
    title: 'Design Trends 2026',
    category: 'Design',
    status: 'published',
    description: 'Top visual design trends shaping the industry in 2026.',
    views: 1250,
    author: 'Ahmed Al Sayed',
  },
  {
    title: 'React Best Practices',
    category: 'Development',
    status: 'published',
    description: 'Modern frontend patterns and best practices for React development.',
    views: 980,
    author: 'Said Mahmoud',
  },
  {
    title: 'Motion in UI',
    category: 'Motion',
    status: 'draft',
    description: 'Animation principles and how to use motion effectively in user interfaces.',
    views: 1250,
    author: 'Ahmed Al Sayed',
  },
  {
    title: 'Brand Strategy Guide',
    category: 'Branding',
    status: 'published',
    description: 'Building strong brands: a comprehensive strategy guide.',
    views: 1250,
    author: 'Sarah Mohammed',
  },
  {
    title: 'CSS Grid Mastery',
    category: 'Development',
    status: 'published',
    description: 'Advanced layout techniques using CSS Grid for modern web design.',
    views: 743,
    author: 'Said Mahmoud',
  },
  {
    title: 'Color Theory Basics',
    category: 'Design',
    status: 'draft',
    description: 'Understanding color theory and its impact on design decisions.',
    views: 891,
    author: 'Ahmed Al Sayed',
  },
  {
    title: 'The Future of Web Development in 2026',
    category: 'Development',
    status: 'published',
    description: "Exploring the latest technologies and trends shaping web development.",
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Why UI/UX Design Matters For Your Business',
    category: 'Design',
    status: 'published',
    description: 'How good UX/UI design drives business growth and user satisfaction.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Building Scalable Mobile Applications',
    category: 'Development',
    status: 'published',
    description: 'Best practices for building mobile apps that scale.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Digital Transformation: A Comprehensive Guide',
    category: 'Development',
    status: 'published',
    description: 'A comprehensive guide to digital transformation for businesses.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Responsive Design Best Practices',
    category: 'Design',
    status: 'published',
    description: 'Essential tips for creating responsive websites that work on all devices.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Introduction To Laravel Framework',
    category: 'Development',
    status: 'published',
    description: 'Getting started with Laravel for modern PHP web development.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'SEO Strategies for 2026',
    category: 'Marketing',
    status: 'published',
    description: 'Effective SEO strategies to boost your website ranking in 2026.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Cloud Computing Essentials',
    category: 'Development',
    status: 'published',
    description: 'Understanding cloud computing fundamentals and services.',
    views: 0,
    author: 'Neoteric Team',
  },
  {
    title: 'Brand Identity Design Guide',
    category: 'Branding',
    status: 'published',
    description: 'How to create a cohesive and memorable brand identity.',
    views: 0,
    author: 'Neoteric Team',
  },
];

// ==========================================
// 5. SETTINGS (from dashboard-settings.html)
// ==========================================
const settings = {
  _singleton: 'site_settings',

  general: {
    logo: '',
    siteName: 'Neoteric Technologies',
    tagline: 'Creative Solutions for Modern Businesses',
    description: 'Neoteric Technologies provides professional design and development services for businesses of all sizes.',
    language: 'English',
    timezone: 'Asia/Jerusalem',
    features: {
      maintenanceMode: false,
      allowComments: true,
      emailNotifications: true,
      analyticsTracking: true,
    },
  },

  contact: {
    email: 'hello@neoteric.tech',
    phone: '+970 59 000 0000',
    address: 'Nablus, West Bank, Palestine',
    businessHours: 'Sun–Thu, 9AM–5PM',
    supportEmail: 'support@neoteric.tech',
  },

  social: {
    facebook: 'https://facebook.com/neoteric',
    twitter: 'https://twitter.com/neoteric',
    linkedin: 'https://linkedin.com/company/neoteric',
    instagram: 'https://instagram.com/neoteric',
  },

  seo: {
    metaTitle: 'Neoteric Technologies – Creative Design & Development',
    metaDescription: 'Professional web design, UI/UX, motion graphics and digital marketing services in Palestine.',
    metaKeywords: 'web design, UI/UX, motion graphics, Palestine, digital agency',
    googleAnalyticsId: '',
    robots: 'index, follow',
  },
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  services,
  projects,
  teamMembers,
  blogs,
  settings,
};
