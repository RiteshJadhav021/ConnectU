# ConnectU Frontend

A modern, responsive React-based frontend for ConnectU - a platform that bridges the gap between current students and alumni for mentorship, networking, and professional guidance. Built with React, Vite, and Tailwind CSS for optimal performance and user experience.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Routing & Navigation](#routing--navigation)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling & Design](#styling--design)
- [Real-time Features](#real-time-features)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Secure login/signup for Students, Alumni, and TPO
- **Interactive Dashboards**: Role-specific dashboards with tailored functionality
- **Real-time Messaging**: Socket.io-powered chat system between students and alumni
- **Connection Management**: Students can request connections with alumni
- **Post Management**: Alumni and TPO can create, edit, and manage posts
- **Profile Management**: Complete profile customization with photo uploads
- **Responsive Design**: Mobile-first design that works on all devices
- **Animated UI**: Smooth GSAP animations for enhanced user experience

### User Experience Features
- **Dynamic Navigation**: Auto-hiding navbar with smooth animations
- **Toast Notifications**: Real-time feedback for all user actions
- **Modal System**: Reusable modal components for forms and confirmations
- **Search & Filter**: Advanced filtering for alumni by skills and companies
- **File Upload**: Drag-and-drop file uploads for profiles and posts
- **Loading States**: Comprehensive loading indicators for all async operations

## 🛠 Tech Stack

### Core Technologies
- **React 19.1.0**: Modern React with hooks and latest features
- **Vite 6.3.5**: Lightning-fast build tool and dev server
- **React Router DOM 7.6.2**: Client-side routing and navigation
- **Tailwind CSS 4.1.10**: Utility-first CSS framework

### Animation & Interaction
- **GSAP 3.13.0**: Professional-grade animations
- **React Icons 5.5.0**: Comprehensive icon library

### Communication & Notifications
- **Socket.io Client 4.8.1**: Real-time bidirectional communication
- **React Toastify 11.0.5**: Toast notifications system

### Development Tools
- **ESLint 9.25.0**: Code linting and quality assurance
- **TypeScript Support**: Type checking for JSX components

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Running ConnectU backend server

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/RiteshJadhav021/ConnectU.git
cd ConnectU
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## ⚙️ Environment Setup

### Vite Configuration
The project uses Vite with a proxy configuration for API calls:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Backend server
    },
  },
})
```

### Backend Integration
Ensure the backend server is running on `http://localhost:5000` or update the proxy configuration and API endpoints accordingly.

## 📁 Project Structure

```
frontend/
├── public/
│   ├── pexels-pixabay-326235.jpg  # Hero image
│   ├── Video1.mp4                 # Landing page video
│   └── vite.svg                   # Vite logo
├── src/
│   ├── assets/
│   │   ├── neon.css               # Custom animations (intentionally blank)
│   │   └── react.svg              # React logo
│   ├── components/                # React components
│   │   ├── auth/                  # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── dashboards/            # Role-specific dashboards
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AlumniDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── TPODashboard.jsx
│   │   ├── messaging/             # Real-time messaging
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ChatHistory.jsx
│   │   │   └── MessageBox.jsx
│   │   ├── posts/                 # Post management
│   │   │   ├── PostPage.jsx
│   │   │   ├── PostFeed.jsx
│   │   │   ├── PostItem.jsx
│   │   │   ├── PostModal.jsx
│   │   │   ├── AlumniPostFeed.jsx
│   │   │   ├── AlumniMyPosts.jsx
│   │   │   ├── TPOMyPosts.jsx
│   │   │   └── MyPosts.jsx
│   │   ├── profiles/              # Profile management
│   │   │   ├── AlumniCard.jsx
│   │   │   ├── AlumniShowcase.jsx
│   │   │   └── StudentProfileMenu.jsx
│   │   ├── connections/           # Connection system
│   │   │   └── StudentConnections.jsx
│   │   ├── landing/               # Landing page components
│   │   │   ├── CenteredVideo.jsx
│   │   │   ├── InfoBoxes.jsx
│   │   │   ├── ITCompaniesMarquee.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── UpcomingEvents.jsx
│   │   │   ├── Counters.jsx
│   │   │   └── FAQSection.jsx
│   │   ├── shared/                # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── QnASection.jsx
│   │   └── hooks/                 # Custom hooks
│   │       └── useGsapSignupAnimation.js
│   ├── socket.js                  # Socket.io configuration
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # App-specific styles
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles (Tailwind imports)
├── eslint.config.js               # ESLint configuration
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🧩 Component Architecture

### Authentication Components
- **Login.jsx**: User authentication with animated UI
- **Signup.jsx**: Multi-step registration with OTP verification

### Dashboard Components
- **StudentDashboard.jsx**: Student interface for browsing alumni, viewing posts
- **AlumniDashboard.jsx**: Alumni interface for managing profile, posts, and connections
- **TPODashboard.jsx**: TPO interface for placement management and posting
- **TeacherDashboard.jsx**: Teacher interface (legacy component)

### Messaging System
- **ChatPage.jsx**: Real-time chat interface between students and alumni
- **ChatHistory.jsx**: Message history display
- **MessageBox.jsx**: Message composition and sending

### Post Management
- **PostFeed.jsx**: Display posts with like/comment functionality
- **PostModal.jsx**: Create and edit post interface
- **AlumniPostFeed.jsx**: Alumni-specific post feed
- **MyPosts.jsx**: User's own posts management

### Profile Components
- **AlumniCard.jsx**: Alumni profile display card
- **AlumniShowcase.jsx**: Featured alumni showcase
- **StudentProfileMenu.jsx**: Student profile management

### Landing Page
- **CenteredVideo.jsx**: Hero video section
- **InfoBoxes.jsx**: Feature highlights
- **ITCompaniesMarquee.jsx**: Scrolling company logos
- **Testimonials.jsx**: User testimonials
- **UpcomingEvents.jsx**: Event listings
- **Counters.jsx**: Statistics display
- **FAQSection.jsx**: Frequently asked questions

## 🗺 Routing & Navigation

### Route Structure
```javascript
// Main application routes
/ - Landing page with all sections
/signup - User registration
/login - User authentication
/dashboard/student - Student dashboard
/dashboard/alumni - Alumni dashboard
/dashboard/tpo - TPO dashboard
/dashboard/student/connections - Student connections
/dashboard/student/post - Create post (student)
/dashboard/student/myposts - Student's posts
/chat/:alumniId - Real-time chat interface
/alumni-posts - Alumni post feed
/tpo-posts - TPO posts
```

### Navigation Features
- **Dynamic Navbar**: Auto-hiding navigation with scroll detection
- **Role-based Routing**: Different interfaces for different user types
- **Protected Routes**: Authentication-required pages
- **Smooth Transitions**: GSAP-powered page transitions

## 🔄 State Management

### Local State Management
- **React Hooks**: useState, useEffect for component state
- **Local Storage**: User authentication and preference persistence
- **Context Pattern**: Implicit state sharing through props

### Data Flow
1. **Authentication State**: Stored in localStorage, accessed globally
2. **Component State**: Local state for UI interactions
3. **API State**: Managed through fetch calls with loading states
4. **Real-time State**: Socket.io for live updates

### State Patterns
```javascript
// Authentication state
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

// Loading states
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Form states
const [form, setForm] = useState({
  email: '',
  password: ''
});
```

## 🔌 API Integration

### API Communication
- **Base URL**: Proxied through Vite to `http://localhost:5000/api`
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Comprehensive error states and user feedback

### API Patterns
```javascript
// Authenticated API calls
const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// File uploads
const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return response.json();
};
```

### API Endpoints Used
- **Authentication**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/verify-otp`
- **User Management**: `/api/student/me`, `/api/alumni/me`, `/api/tpo/me`
- **Posts**: `/api/alumni/posts`, `/api/tpo/posts`
- **Connections**: `/api/connections/request`, `/api/connections/respond`
- **Messaging**: `/api/messages/send`, `/api/messages/conversation`
- **File Upload**: `/api/*/photo` endpoints

## 🎨 Styling & Design

### Tailwind CSS Implementation
- **Utility-First Approach**: Comprehensive use of Tailwind utilities
- **Custom Components**: Reusable component classes
- **Responsive Design**: Mobile-first responsive layouts
- **Color Scheme**: Consistent color palette with cyan/blue theme

### Design System
```css
/* Primary Colors */
bg-cyan-600, bg-indigo-600, bg-blue-600
text-cyan-700, text-indigo-700, text-blue-700

/* Gradients */
bg-gradient-to-r from-cyan-400 to-blue-600

/* Shadows */
shadow-lg, shadow-xl, shadow-2xl

/* Animations */
transition-all duration-200
hover:scale-105 transform
```

### GSAP Animations
- **Navbar Animations**: Smooth show/hide on scroll
- **Logo Animations**: Continuous rotation and scaling
- **Form Animations**: Interactive element animations
- **Page Transitions**: Smooth component mounting

## 💬 Real-time Features

### Socket.io Integration
```javascript
// Socket connection
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { autoConnect: false });

// Room-based messaging
socket.emit('joinRoom', roomId);
socket.emit('sendMessage', { roomId, message });
socket.on('receiveMessage', handleIncomingMessage);
```

### Real-time Features
- **Live Messaging**: Instant message delivery
- **Connection Notifications**: Real-time connection request updates
- **Presence Indicators**: Online/offline status
- **Message History**: Persistent chat history

## 🔨 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **ESLint Integration**: Code quality enforcement
- **TypeScript Support**: Type checking for JSX
- **Development Proxy**: Automatic API request proxying

### Code Style Guidelines
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Organization**: External libraries, internal components, styles
- **Error Handling**: Comprehensive try-catch blocks with user feedback

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

### Build Output
- Optimized and minified JavaScript bundles
- CSS optimization and purging
- Asset optimization and compression
- Source maps for debugging

### Deployment Considerations
- **Environment Variables**: Configure API endpoints for production
- **Static Hosting**: Compatible with Netlify, Vercel, GitHub Pages
- **CDN Integration**: Optimized for content delivery networks
- **Browser Compatibility**: Modern browser support with fallbacks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Make changes with proper testing
4. Commit changes (`git commit -m 'Add AmazingFeature'`)
5. Push to branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Code Standards
- Follow React best practices and hooks guidelines
- Use Tailwind CSS utilities consistently
- Implement proper error handling
- Add meaningful comments for complex logic
- Ensure responsive design on all screen sizes

### Testing Guidelines
- Test all user interactions and edge cases
- Verify API integration and error handling
- Check responsive design across devices
- Validate accessibility requirements

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Features**: ES6+, WebSocket support, LocalStorage

## 📄 License

This project is licensed under the ISC License.

## 📞 Contact

**Developer**: Ritesh Jadhav And Adinath Jabade 
**Repository**: [ConnectU](https://github.com/RiteshJadhav021/ConnectU)  
**Frontend**: Located in `/frontend` directory

For support or questions, please open an issue in the GitHub repository.

---

**Note**: This frontend requires the ConnectU backend server to be running for full functionality. Make sure to set up and start the backend server before running the frontend application.
