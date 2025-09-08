# Space Max Frontend

A beautiful React application for browsing and discovering rental spaces.

## Features

- 🎨 Beautiful card-based layout with rich color palette
- 🔍 Advanced search and filtering capabilities
- 📱 Fully responsive design
- ⚡ Fast and modern UI with smooth animations
- 🏠 Support for multiple space types (garages, backyards, basements, etc.)
- �� Clear pricing display with multiple time periods
- 🛡️ Availability status indicators
- 🎯 Amenity icons and descriptions

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for beautiful icons
- **Axios** for API communication

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Integration

The app connects to the Space Max backend API running on `http://localhost:8000/api/v1`. Make sure your backend server is running before starting the frontend.

## Color Palette

The app uses a rich, inviting color palette:
- **Primary**: Indigo gradients (#6366f1 to #8b5cf6)
- **Secondary**: Purple accents (#a855f7 to #7c3aed)
- **Accent**: Pink highlights (#ec4899)
- **Background**: Soft gradients from indigo to purple
- **Cards**: Clean white with subtle shadows

## Components

- **SpaceCard**: Individual space display with rich information
- **SpaceList**: Grid layout with search and filtering
- **API Service**: Handles all backend communication

## Responsive Design

The app is fully responsive and works great on:
- Desktop (4-column grid)
- Tablet (2-3 column grid)
- Mobile (1-column layout)
