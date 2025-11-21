# Portfolio

![Deploy Status](https://github.com/minhngo248/minhngo248.github.io/actions/workflows/deploy.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D25.0.0-brightgreen)
![Vite](https://img.shields.io/badge/vite-7.0.0-646CFF?logo=vite)
![React](https://img.shields.io/badge/react-19.0.0-61DAFB?logo=react)

A modern portfolio website built with React and Vite, featuring responsive design with Tailwind CSS.

## Features

- ⚡️ Lightning-fast development with Vite
- ⚛️ React 19 with modern JSX transform
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🎯 Multiple pages: Home, About, Education
- 🚀 Optimized production builds

## Prerequisites

- Node.js >= 25.0.0
- npm (comes with Node.js)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/minhngo248/minhngo248.github.io.git
cd minhngo248.github.io
```

2. Install dependencies:
```bash
npm install
```

## Available Scripts

### `npm run dev`

Starts the Vite development server with Hot Module Replacement (HMR).

- Opens automatically at [http://localhost:5173](http://localhost:5173)
- Changes are reflected instantly without full page reload
- Fast refresh preserves component state

### `npm run build`

Builds the application for production to the `dist` folder.

- Optimizes and minifies code for best performance
- Generates hashed filenames for cache busting
- Creates optimized CSS with only used Tailwind classes
- Ready for deployment

### `npm run preview`

Serves the production build locally for testing.

- Previews the built application before deployment
- Useful for verifying production behavior
- Runs on a local server (typically port 4173)

## Project Structure

```
portfolio/
├── index.html              # Entry point HTML
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies and scripts
└── src/
    ├── main.jsx            # Application entry point
    ├── App.jsx             # Main application component
    └── index.css           # Global styles with Tailwind
```

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### GitHub Pages Deployment

1. Ensure the workflow file exists at `.github/workflows/deploy.yml`
2. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions
3. Push to the `master` branch to trigger deployment
4. The site will be available at `https://minhngo248.github.io`

### Manual Deployment

To deploy manually to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

## Technology Stack

- **Build Tool**: Vite 7.0
- **Framework**: React 19
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Node.js**: >= 25.0.0

## Learn More

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
