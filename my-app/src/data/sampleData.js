// Sample data for ProTrackr prototype

// Sample users
export const sampleUsers = [
  {
    id: '1',
    name: 'Rahul Chowdary',
    email: 'rahul@example.com',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    avatarURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer passionate about AI and web technologies. Currently working on machine learning projects.',
    publicProfile: true
  },
  {
    id: '2',
    name: 'Natta Samson Jaya Raju',
    email: 'samson@example.com',
    role: 'student',
    department: 'Computer Science',
    year: '2nd Year',
    avatarURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    bio: 'Mobile app developer and UI/UX enthusiast. Love creating intuitive user experiences.',
    publicProfile: true
  },
  {
    id: '3',
    name: 'Prof. Praveen Kumar',
    email: 'praveen@example.edu',
    role: 'faculty',
    department: 'Computer Science',
    avatarURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Professor of Computer Science specializing in Software Engineering and Project Management.',
    publicProfile: true
  },
  {
    id: '4',
    name: 'Hari Siddhartha Reddy',
    email: 'hari@example.edu',
    role: 'admin',
    department: 'Administration',
    avatarURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    bio: 'System Administrator managing academic platforms and student data.',
    publicProfile: false
  }
];

// Sample projects
export const sampleProjects = [
  {
    id: '1',
    ownerId: '1',
    title: 'AI-Powered Study Assistant',
    abstract: 'A machine learning application that helps students organize study materials and provides personalized learning recommendations.',
    tags: ['AI', 'Machine Learning', 'React', 'Python', 'NLP'],
    coverImageURL: 'https://images.unsplash.com/photo-1565687981296-535f09db714e?w=800&h=600&fit=crop',
    media: [
      'https://images.unsplash.com/photo-1565687981296-535f09db714e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
    ],
    repoLink: 'https://github.com/rahul/ai-study-assistant',
    demoLink: 'https://ai-study-demo.vercel.app',
    published: true,
    visibility: 'public',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-20',
    progress: 85,
    techStack: ['React', 'Node.js', 'Python', 'TensorFlow', 'MongoDB'],
    features: ['Smart categorization', 'Personalized recommendations', 'Progress tracking', 'Collaborative notes']
  },
  {
    id: '2',
    ownerId: '1',
    title: 'Campus Navigation App',
    abstract: 'Mobile application for indoor and outdoor navigation within university campus using AR technology.',
    tags: ['Mobile', 'AR', 'React Native', 'GPS', 'Navigation'],
    coverImageURL: 'https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=800&h=600&fit=crop',
    media: [
      'https://images.unsplash.com/photo-1693011142814-aa33d7d1535c?w=800&h=600&fit=crop'
    ],
    repoLink: 'https://github.com/rahul/campus-nav',
    published: false,
    visibility: 'mentor-only',
    createdAt: '2024-08-15',
    updatedAt: '2024-09-18',
    progress: 60,
    techStack: ['React Native', 'ARCore', 'Firebase', 'Google Maps API'],
    features: ['AR wayfinding', 'Real-time location', 'Building information', 'Accessibility features']
  },
  {
    id: '3',
    ownerId: '2',
    title: 'E-Commerce Dashboard',
    abstract: 'Modern admin dashboard for e-commerce platforms with real-time analytics and inventory management.',
    tags: ['Dashboard', 'React', 'Analytics', 'E-commerce', 'Charts'],
    coverImageURL: 'https://images.unsplash.com/photo-1758518730136-1bf4fa26ccbf?w=800&h=600&fit=crop',
    media: [
      'https://images.unsplash.com/photo-1758518730136-1bf4fa26ccbf?w=800&h=600&fit=crop'
    ],
    repoLink: 'https://github.com/samson/ecommerce-dashboard',
    demoLink: 'https://ecommerce-dash-demo.vercel.app',
    published: true,
    visibility: 'public',
    createdAt: '2024-07-10',
    updatedAt: '2024-09-15',
    progress: 90,
    techStack: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS', 'Node.js'],
    features: ['Real-time analytics', 'Inventory tracking', 'Sales reports', 'User management']
  },
  {
    id: '4',
    ownerId: '2',
    title: 'Social Media App UI',
    abstract: 'Modern social media application interface with focus on user experience and accessibility.',
    tags: ['UI/UX', 'React', 'Social Media', 'Accessibility', 'Design'],
    coverImageURL: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=600&fit=crop',
    media: [],
    repoLink: 'https://github.com/samson/social-app-ui',
    published: false,
    visibility: 'draft',
    createdAt: '2024-09-05',
    updatedAt: '2024-09-22',
    progress: 35,
    techStack: ['React', 'Framer Motion', 'SCSS', 'Storybook'],
    features: ['Dark/light themes', 'Responsive design', 'Micro-interactions', 'WCAG compliance']
  }
];

// Sample milestones
export const sampleMilestones = [
  {
    id: '1',
    projectId: '1',
    title: 'Research and Planning',
    description: 'Complete market research and define project requirements',
    dueDate: '2024-09-05',
    status: 'completed',
    percentComplete: 100
  },
  {
    id: '2',
    projectId: '1',
    title: 'MVP Development',
    description: 'Build core functionality and basic UI',
    dueDate: '2024-09-15',
    status: 'completed',
    percentComplete: 100
  },
  {
    id: '3',
    projectId: '1',
    title: 'AI Integration',
    description: 'Implement machine learning models and recommendation engine',
    dueDate: '2024-09-25',
    status: 'in-progress',
    percentComplete: 80
  },
  {
    id: '4',
    projectId: '1',
    title: 'Testing and Deployment',
    description: 'Complete testing and deploy to production',
    dueDate: '2024-10-01',
    status: 'planned',
    percentComplete: 0
  }
];

// Sample feedback
export const sampleFeedback = [
  {
    id: '1',
    projectId: '1',
    authorId: '3',
    timestamp: '2024-09-20T10:30:00Z',
    content: 'Excellent progress on the AI integration. The recommendation algorithm shows promising results. Consider adding more diverse training data.',
    type: 'general',
    status: 'open',
    rating: 4
  },
  {
    id: '2',
    projectId: '3',
    authorId: '3',
    timestamp: '2024-09-18T14:15:00Z',
    content: 'Great work on the dashboard design. The analytics visualization is very clear and intuitive.',
    type: 'general',
    status: 'resolved',
    rating: 5
  }
];

// Sample notifications
export const sampleNotifications = [
  {
    id: '1',
    userId: '1',
    type: 'feedback',
    message: 'Prof. Arvind Rao left feedback on your AI-Powered Study Assistant project',
    read: false,
    createdAt: '2024-09-20T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: 'milestone',
    message: 'Milestone "Testing and Deployment" is due in 3 days',
    read: false,
    createdAt: '2024-09-22T09:00:00Z'
  },
  {
    id: '3',
    userId: '2',
    type: 'review',
    message: 'Your E-Commerce Dashboard project has been approved',
    read: true,
    createdAt: '2024-09-19T16:45:00Z'
  }
];

// Helper functions
export const getUserById = (id) => {
  return sampleUsers.find(user => user.id === id);
};

export const getProjectsByUserId = (userId) => {
  return sampleProjects.filter(project => project.ownerId === userId);
};

export const getMilestonesByProjectId = (projectId) => {
  return sampleMilestones.filter(milestone => milestone.projectId === projectId);
};

export const getFeedbackByProjectId = (projectId) => {
  return sampleFeedback.filter(feedback => feedback.projectId === projectId);
};

export const getNotificationsByUserId = (userId) => {
  return sampleNotifications.filter(notification => notification.userId === userId);
};
