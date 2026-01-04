# Technology Stack

## Core Technologies

- **Build Tool**: Vite 7.0 (fast development server with HMR)
- **Framework**: React 19 (latest with modern JSX transform)
- **Styling**: Tailwind CSS 3.4 (utility-first CSS framework)
- **Routing**: React Router DOM 7.9 (HashRouter for GitHub Pages compatibility)
- **Icons**: Lucide React (modern icon library)
- **Node.js**: >= 25.0.0 (required minimum version)

## Development Setup

### Prerequisites
- Node.js >= 25.0.0
- npm (package manager)

### Common Commands

```bash
# Install dependencies
npm install

# Start development server (opens at localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

## Build Configuration

- **Vite Config**: Standard React setup with port 5173, auto-open browser
- **Tailwind Config**: Scans all HTML and JSX/TSX files in src/
- **PostCSS**: Configured for Tailwind CSS processing
- **Output**: Static files in `dist/` folder ready for deployment

## Deployment

- **Primary**: GitHub Actions workflow for automatic GitHub Pages deployment
- **Trigger**: Push to `master` branch
- **Build**: `npm run build` creates optimized production bundle
- **Hosting**: GitHub Pages at `https://minhngo248.github.io`

## Performance Features

- Hot Module Replacement (HMR) for instant development feedback
- Tree-shaking and code splitting in production builds
- Optimized CSS with unused Tailwind classes removed
- Hashed filenames for cache busting