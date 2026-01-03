# Design Document: Vite Migration

## Overview

This design document outlines the technical approach for migrating a Create React App (CRA) portfolio application to Vite. The migration involves restructuring the project to follow Vite conventions, updating build configuration, managing dependencies, and ensuring all existing functionality remains intact. The application will target Node.js 25 and maintain version 0.2.0.

The migration strategy focuses on minimal disruption to the existing codebase while adopting Vite's modern build tooling. The portfolio application is a single-page React application with client-side routing, Tailwind CSS styling, and Lucide React icons.

## Architecture

### Build System Architecture

The application will transition from webpack-based CRA to Vite's ESBuild-powered build system:

- **Development Mode**: Vite dev server with native ES modules and instant HMR
- **Production Mode**: Rollup-based bundling with optimized code splitting
- **Entry Point**: HTML-first approach with script module imports

### Project Structure

```
portfolio/
├── index.html              # Root HTML file (Vite entry point)
├── vite.config.js          # Vite configuration
├── package.json            # Updated dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── .gitignore              # Updated for Vite (dist instead of build)
├── README.md               # Updated documentation with badges
└── src/
    ├── main.jsx            # Application entry point
    ├── App.jsx             # Main application component
    └── index.css           # Global styles with Tailwind directives
```

### Migration Strategy

1. **Preserve existing code**: Keep App.jsx functionality unchanged
2. **Restructure entry points**: Move from CRA's src/index.js to Vite's main.jsx + root index.html
3. **Update configuration**: Replace CRA config with Vite config files
4. **Dependency cleanup**: Remove CRA dependencies, add Vite dependencies
5. **Script updates**: Replace CRA scripts with Vite commands

## Components and Interfaces

### Configuration Files

#### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
```

#### tailwind.config.js
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Entry Points

#### index.html (Root)
- Serves as the application entry point for Vite
- Contains script module import to main.jsx
- Includes root div for React mounting

#### src/main.jsx
- Imports React and ReactDOM
- Imports App component
- Imports global CSS
- Mounts React application to DOM

#### src/App.jsx
- Existing Portfolio component (minimal changes)
- Remove unnecessary React import (JSX transform handles it)
- All functionality preserved

### Package Configuration

#### package.json Structure
```json
{
  "name": "portfolio",
  "version": "0.2.0",
  "type": "module",
  "engines": {
    "node": ">=25.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.1",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

## Data Models

This migration does not introduce new data models. The existing application state management remains unchanged:

- **Component State**: useState hooks for menu toggle and page navigation
- **Props**: Component props for navigation and content rendering
- **Static Data**: Hardcoded arrays for skills, projects, courses, and education


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Migration Verification Properties

Most of the acceptance criteria for this migration are specific configuration checks and examples rather than universal properties. The migration is primarily about transforming the project structure and configuration from CRA to Vite, which involves verifying specific files, dependencies, and configurations exist and are correct.

The testable criteria are primarily examples that verify:
- Specific files exist in expected locations
- Configuration files contain expected content
- Package.json has correct dependencies and scripts
- Build and dev commands execute successfully
- The application renders correctly after migration

Since this is a migration project rather than new feature development, there are no universal properties that apply across all inputs. Instead, we have specific examples and checks that validate the migration was completed correctly.

### Example-Based Verification

The following examples will be verified as part of the migration validation:

**Example 1: Project structure verification**
- Verify index.html exists at root
- Verify src/main.jsx exists
- Verify src/App.jsx exists in src directory
- Verify vite.config.js exists
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

**Example 2: Package.json configuration**
- Verify version is "0.2.0"
- Verify engines.node specifies ">=25.0.0"
- Verify vite and @vitejs/plugin-react are in devDependencies
- Verify react-scripts is not in dependencies
- Verify scripts include "dev", "build", "preview" and not "start", "test", "eject"
**Validates: Requirements 1.4, 2.1, 5.5, 6.1, 6.2**

**Example 3: Tailwind configuration**
- Verify tailwind.config.js exists
- Verify postcss.config.js exists
- Verify src/index.css exists with Tailwind directives
- Verify tailwind.config.js content includes "./src/**/*.{js,ts,jsx,tsx}"
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

**Example 4: Build and dev server execution**
- Verify npm run dev starts without errors
- Verify npm run build completes and creates dist directory
- Verify dist directory contains index.html and asset files
**Validates: Requirements 1.3, 5.1, 5.2**

**Example 5: Application functionality**
- Verify application renders home page
- Verify navigation switches between pages
- Verify mobile menu toggles correctly
- Verify Lucide icons render
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

**Example 6: README documentation**
- Verify README contains badges
- Verify README documents Vite commands (dev, build, preview)
- Verify README does not reference Create React App
**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

## Error Handling

### Build Errors

**Dependency Resolution Failures**
- If npm install fails due to incompatible packages, check Node.js version
- Verify package.json specifies correct version ranges
- Clear node_modules and package-lock.json if needed

**Build Configuration Errors**
- If vite.config.js has syntax errors, validate against Vite documentation
- Ensure @vitejs/plugin-react is properly imported and configured
- Check that all paths in configuration are correct

**Import Resolution Errors**
- If imports fail, verify file extensions (.jsx) are used correctly
- Ensure index.html script tag uses type="module"
- Check that main.jsx is referenced correctly in index.html

### Runtime Errors

**Component Rendering Failures**
- If App component doesn't render, check main.jsx mounting code
- Verify root div exists in index.html
- Check browser console for specific error messages

**Style Loading Issues**
- If Tailwind styles don't apply, verify index.css is imported in main.jsx
- Check that PostCSS and Tailwind are configured correctly
- Ensure content paths in tailwind.config.js match actual file locations

**HMR Issues**
- If hot reload doesn't work, restart dev server
- Check that Vite React plugin is configured
- Verify no syntax errors in components

### Migration-Specific Issues

**Port Conflicts**
- If dev server fails to start, check if port 3000 is in use
- Configure alternative port in vite.config.js if needed

**Path Resolution**
- If assets don't load, verify paths are relative to index.html location
- Use Vite's public directory for static assets if needed

## Testing Strategy

### Manual Testing Approach

Since this is a migration project, testing will primarily consist of manual verification and example-based checks rather than property-based testing. The testing approach will validate that:

1. **Configuration is correct**: All config files exist and contain expected content
2. **Build system works**: Dev and build commands execute successfully
3. **Functionality is preserved**: All existing features work after migration
4. **Dependencies are clean**: No CRA dependencies remain, all Vite dependencies present

### Unit Testing

Unit tests are not applicable for this migration as we are not writing new application logic. The existing Portfolio component functionality remains unchanged.

### Integration Testing

**Build System Integration**
- Test that `npm run dev` starts the development server
- Test that `npm run build` produces a dist directory with assets
- Test that `npm run preview` serves the built application
- Verify the application is accessible at localhost:3000 (or configured port)

**Component Integration**
- Manually test navigation between pages
- Manually test mobile menu toggle
- Verify all icons render correctly
- Verify all styles apply correctly

### Validation Checklist

After migration, verify:
- [ ] All configuration files exist and are correct
- [ ] Package.json has version 0.2.0 and Node 25 requirement
- [ ] No CRA dependencies remain
- [ ] All Vite dependencies are installed
- [ ] Dev server starts without errors
- [ ] Build completes without errors
- [ ] Application renders correctly in browser
- [ ] All three pages (Home, About, Education) display correctly
- [ ] Navigation works
- [ ] Mobile menu works
- [ ] Icons display
- [ ] Styles apply correctly
- [ ] README is updated with badges and Vite instructions

### Testing Tools

- **Manual browser testing**: Verify UI functionality
- **npm scripts**: Test build and dev commands
- **File system checks**: Verify project structure
- **Package inspection**: Verify dependencies in package.json

No property-based testing framework is needed for this migration as there are no universal properties to test across generated inputs. The migration is validated through specific examples and manual verification.
