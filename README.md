# RAG News ChatBot - Frontend

A modern, real-time news chatbot application built with React and Socket.IO that leverages Retrieval-Augmented Generation (RAG) to provide intelligent responses based on a comprehensive news corpus.

**🌐 Live Demo**: [rag-chatbot-frontend-lake.vercel.app](https://rag-chatbot-frontend-lake.vercel.app)  
**🔗 Backend API**: [rag-chatbot-backend-oxlx.onrender.com](https://rag-chatbot-backend-oxlx.onrender.com)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [UI/UX Features](#uiux-features)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)
- [Testing](#testing)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This frontend application provides an intuitive interface for the RAG-powered news chatbot system. Built with modern React patterns and real-time WebSocket communication, it delivers a seamless chat experience with intelligent news-based responses, session management, and responsive design across all devices.

### Key Capabilities
- Real-time chat interface with WebSocket-based communication
- RAG-powered responses with intelligent answers from news corpus
- Session management with persistent chat history
- Multi-session support for creating and managing multiple conversations
- Source attribution with transparent sourcing and article links
- Trending topics for quick access to popular news categories

## Features

### Core Functionality
- **Real-time Chat Interface**: WebSocket-based communication for instant messaging
- **RAG-Powered Responses**: Intelligent answers generated from news corpus using AI
- **Session Management**: Persistent chat sessions with history
- **Multi-Session Support**: Create, manage, and switch between multiple chat sessions
- **Source Attribution**: Transparent sourcing with metadata and article links
- **Trending Topics**: Quick access to popular news categories

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Status Updates**: Live feedback during message processing
- **Typing Indicators**: Visual feedback for ongoing conversations
- **Connection Status**: Real-time connection monitoring
- **Animated UI**: Smooth transitions and engaging animations

### Technical Features
- **Component-Based Architecture**: Modular React components with SCSS styling
- **Socket.IO Integration**: Real-time bidirectional communication
- **REST API Integration**: Comprehensive backend API integration
- **Error Handling**: Robust error management and fallback mechanisms
- **Performance Optimized**: Efficient rendering and state management

## Technology Stack

### Frontend
- **React**: 18.3.1 - Modern React with hooks and functional components
- **Vite**: 5.4.2 - Fast build tool and development server
- **SCSS/Sass**: 1.92.1 - Advanced CSS preprocessing
- **Socket.IO Client**: 4.8.1 - Real-time communication
- **Lucide React**: 0.344.0 - Modern icon library
- **Lottie React**: 2.4.1 - Animation library

### Development Tools
- **ESLint**: 9.9.1 - Code linting and quality assurance
- **PostCSS**: 8.4.35 - CSS processing and optimization

## Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (or yarn)
- **RAG News ChatBot Backend**: Available at [rag-chatbot-backend-oxlx.onrender.com](https://rag-chatbot-backend-oxlx.onrender.com)

## Live Application

### Frontend Deployment
- **Platform**: Vercel
- **URL**: [rag-chatbot-frontend-lake.vercel.app](https://rag-chatbot-frontend-lake.vercel.app)
- **Features**: 
  - Automatic deployments from main branch
  - Global CDN distribution
  - HTTPS enabled
  - Optimized build performance

### Backend Integration
- **Platform**: Render
- **URL**: [rag-chatbot-backend-oxlx.onrender.com](https://rag-chatbot-backend-oxlx.onrender.com)
- **Health Check**: [/health endpoint](https://rag-chatbot-backend-oxlx.onrender.com/health)

## Installation

### 1. Clone Repository
```

## Security Considerations

- **Input Sanitization**: All user inputs are properly sanitized
- **XSS Protection**: HTML content is safely rendered
- **Connection Security**: Secure WebSocket connections
- **Error Handling**: Graceful error management without exposing sensitive data

## Testing

### Running Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
- Component unit tests
- Integration tests for API calls
- Socket.IO connection tests
- User interaction tests

## Performance

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite-powered efficient bundling
- **Image Optimization**: Optimized asset loading
- **Caching**: Intelligent caching strategies
- **Memory Management**: Proper cleanup of event listeners

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 500KB gzipped

## Troubleshooting

### Common Issues

#### Connection Problems
```bash
# Check backend server status
curl https://rag-chatbot-backend-oxlx.onrender.com/health

# Verify WebSocket connection
# Check browser console for connection errors
```

#### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### Styling Issues
```bash
# Rebuild SCSS
npm run build:css

# Check for SCSS compilation errors
npm run lint:scss
```

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Component Guidelines
- Use functional components with hooks
- Implement proper prop validation
- Follow SCSS naming conventions (BEM methodology)
- Ensure responsive design
- Add proper accessibility attributes

## License

This project is open source and available under the [MIT License](LICENSE).

```
Copyright (c) 2024 RAG News ChatBot - Frontend

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## Support & Contact

For technical support and questions:

- **Live Application**: [rag-chatbot-frontend-lake.vercel.app](https://rag-chatbot-frontend-lake.vercel.app)
- **Backend API**: [rag-chatbot-backend-oxlx.onrender.com](https://rag-chatbot-backend-oxlx.onrender.com)
- **Health Check**: [Backend Health Status](https://rag-chatbot-backend-oxlx.onrender.com/health)
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review application logs in browser console

---

Built with ❤️ using React, Socket.IO, and modern web technologies.bash
git clone <repository-url>
cd rag-chatbot-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_BACKEND_HOST=rag-chatbot-backend-oxlx.onrender.com
# For local development, use:
# VITE_BACKEND_HOST=localhost:5000
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── ChatHeader/      # Chat interface header
│   ├── ChatMessage/     # Individual message component
│   ├── ConnectionStatus/# Connection status indicator
│   ├── InputContainer/  # Message input wrapper
│   ├── LoadingSpinner/  # Loading animation component
│   ├── MainContent/     # Main chat interface
│   ├── MessageInput/    # Message input field
│   ├── MessageMetadata/ # Message source metadata
│   ├── MessagesContainer/ # Messages display container
│   ├── RAGNewsChatBot/  # Main application component
│   ├── Sidebar/         # Session management sidebar
│   └── TrendingTopics/  # Trending topics suggestions
├── hooks/               # Custom React hooks
│   └── useSocket.js     # Socket.IO connection hook
├── services/            # API and service layers
│   ├── api.js          # REST API integration
│   └── socketService.js # Socket.IO service
├── styles/              # Global styles and variables
│   ├── _variables.scss  # SCSS variables
│   └── _mixins.scss     # SCSS mixins
├── utils/               # Utility functions
│   └── helpers.js       # Common helper functions
└── assets/              # Static assets (images, animations)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## API Integration

### Backend Endpoints

The application integrates with the following backend endpoints:

#### Chat Sessions
- `GET /api/v1/chat/sessions` - Retrieve all chat sessions
- `POST /api/v1/chat/sessions` - Create new chat session
- `GET /api/v1/chat/sessions/:id/history` - Get session history
- `DELETE /api/v1/chat/sessions/:id` - Delete chat session
- `DELETE /api/v1/chat/sessions/:id/cache` - Clear session cache

#### News Search
- `GET /api/v1/news/search` - Search news corpus with RAG

### WebSocket Events

Real-time communication through Socket.IO:

#### Client Events
- `join_session` - Join a chat session
- `send_message` - Send message to session
- `get_history` - Request session history
- `clear_session` - Clear session data
- `typing` - Send typing indicator

#### Server Events
- `session_joined` - Session join confirmation
- `new_message` - New message received
- `session_history` - Historical messages
- `session_cleared` - Session cleared confirmation
- `status_update` - Processing status updates
- `user_typing` - Typing indicators

## UI/UX Features

### Responsive Design
- **Desktop**: Full sidebar with session management
- **Tablet**: Collapsible sidebar overlay
- **Mobile**: Optimized touch interface

### Animations & Interactions
- Smooth message animations
- Loading spinners and status updates
- Hover effects and micro-interactions
- Typing indicators
- Connection status indicators

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast color scheme
- Responsive font sizing

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables

#### Development Environment
```env
VITE_BACKEND_HOST=localhost:5000
```

#### Production Environment
```env
VITE_BACKEND_HOST=rag-chatbot-backend-oxlx.onrender.com
```

### Deployment Platforms

#### Current Deployment
- **Frontend**: Deployed on **Vercel** - [rag-chatbot-frontend-lake.vercel.app](https://rag-chatbot-frontend-lake.vercel.app)
- **Backend**: Deployed on **Render** - [rag-chatbot-backend-oxlx.onrender.com](https://rag-chatbot-backend-oxlx.onrender.com)

#### Compatible Platforms
- **Vercel** - Recommended for React applications (Currently used)
- **Netlify** - Static site deployment
- **AWS S3 + CloudFront** - Scalable cloud deployment
- **Docker** - Containerized deployment

### Deployment Configuration

#### Vercel Deployment
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "environmentVariables": {
    "VITE_BACKEND_HOST": "rag-chatbot-backend-oxlx.onrender.com"
  }
}
```