# Project Structure

## Root Level Organization

```
portfolio/
├── index.html              # Entry point HTML template
├── package.json            # Dependencies and npm scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── .github/workflows/      # GitHub Actions deployment
└── src/                    # Source code directory
```

## Source Code Structure

```
src/
├── main.jsx                # Application entry point with React root
├── App.jsx                 # Main app component with routing
├── index.css               # Global styles (Tailwind imports)
├── components/             # Reusable UI components
│   ├── Navigation.jsx      # Main navigation bar
│   ├── MobileMenu.jsx      # Mobile navigation menu
│   ├── Footer.jsx          # Site footer
│   └── ProjectCard.jsx     # Project display card
├── pages/                  # Route-based page components
│   ├── HomePage.jsx        # Landing page
│   ├── AboutPage.jsx       # About/bio page
│   ├── EducationPage.jsx   # Education history
│   └── ProjectDetailPage.jsx # Dynamic project details
└── data/                   # Static data exports
    ├── projects.js         # Project portfolio data
    ├── skills.js           # Technical skills data
    ├── education.js        # Education history data
    └── certifications.js   # Professional certifications
```

## Architectural Patterns

### Component Organization
- **Pages**: Route-level components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Data**: Static content exported from `src/data/`

### Routing Structure
- Uses HashRouter for GitHub Pages compatibility
- Routes: `/`, `/about`, `/education`, `/projects/:projectId`
- Dynamic routing for project detail pages

### Styling Conventions
- Tailwind utility classes for all styling
- Dark theme with slate color palette
- Blue accent color (#3B82F6) for highlights
- Responsive design with mobile-first approach

### File Naming
- PascalCase for React components (e.g., `HomePage.jsx`)
- camelCase for data files (e.g., `projects.js`)
- kebab-case for project IDs in data

### Data Structure
- Export arrays/objects from data files
- Use consistent ID-based references for dynamic content
- Include both summary and detailed descriptions for projects