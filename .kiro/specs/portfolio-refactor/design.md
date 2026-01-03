# Design Document

## Overview

This design document outlines the architecture and implementation approach for refactoring the portfolio application into a maintainable, component-based structure with proper routing and data-driven rendering. The refactoring will separate concerns, improve code organization, and enable easy content updates through structured data arrays.

## Architecture

The application will follow a component-based architecture with the following structure:

```
src/
├── components/
│   ├── Navigation.jsx
│   ├── MobileMenu.jsx
│   ├── Footer.jsx
│   └── ProjectCard.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── EducationPage.jsx
│   └── ProjectDetailPage.jsx
├── data/
│   ├── skills.js
│   ├── projects.js
│   ├── education.js
│   └── certifications.js
├── App.jsx
└── main.jsx
```

### Routing Strategy

The application will use React Router for client-side routing:
- `/` - Home Page
- `/about` - About Page
- `/education` - Education Page
- `/projects/:projectId` - Project Detail Page

### State Management

The application will use React Router's navigation for page transitions, eliminating the need for local state management of `currentPage`. The mobile menu state will remain in the Navigation component.

## Components and Interfaces

### Navigation Component

**Purpose:** Provides the top navigation bar with branding and page links.

**Props:** None

**State:**
- `isMenuOpen` (boolean) - Controls mobile menu visibility

**Interface:**
```javascript
export default function Navigation()
```

### MobileMenu Component

**Purpose:** Renders the mobile navigation menu.

**Props:**
- `isOpen` (boolean) - Whether the menu is visible
- `onClose` (function) - Callback to close the menu

**Interface:**
```javascript
export default function MobileMenu({ isOpen, onClose })
```

### HomePage Component

**Purpose:** Renders the landing page with introduction and call-to-action.

**Props:** None

**Interface:**
```javascript
export default function HomePage()
```

### AboutPage Component

**Purpose:** Displays biography, skills, and recent projects.

**Props:** None

**Data Dependencies:**
- `skills` array from `data/skills.js`
- `projects` array from `data/projects.js`

**Interface:**
```javascript
export default function AboutPage()
```

### EducationPage Component

**Purpose:** Displays education, certifications, and online courses.

**Props:** None

**Data Dependencies:**
- `education` array from `data/education.js`
- `certifications` array from `data/certifications.js`
- `courses` array from `data/education.js`

**Interface:**
```javascript
export default function EducationPage()
```

### ProjectDetailPage Component

**Purpose:** Displays detailed information about a specific project.

**Props:** None (uses URL parameter)

**Data Dependencies:**
- `projects` array from `data/projects.js`

**Interface:**
```javascript
export default function ProjectDetailPage()
```

### ProjectCard Component

**Purpose:** Reusable component for displaying project summary cards.

**Props:**
- `project` (object) - Project data object
- `showLink` (boolean) - Whether to show "View Project" link

**Interface:**
```javascript
export default function ProjectCard({ project, showLink = true })
```

### Footer Component

**Purpose:** Renders the footer with copyright and social links.

**Props:** None

**Interface:**
```javascript
export default function Footer()
```

## Data Models

### Skill Object

```javascript
{
  name: string,        // Display name of the skill
  category?: string    // Optional category for grouping
}
```

### Project Object

```javascript
{
  id: string,              // Unique identifier for routing
  title: string,           // Project title
  description: string,     // Short description for card
  detailedDescription: string,  // Full description for detail page
  technologies: string[],  // Array of technology names
  image: string,          // URL or path to project image
  link: string,           // External project link
  github?: string         // Optional GitHub repository link
}
```

### Education Object

```javascript
{
  id: string,           // Unique identifier
  degree: string,       // Degree or program name
  institution: string,  // School or institution name
  year: string,         // Graduation year or date range
  description: string   // Additional details or coursework
}
```

### Certification Object

```javascript
{
  id: string,           // Unique identifier
  name: string,         // Certification name
  issuer: string,       // Issuing organization
  date: string,         // Issue date
  description: string,  // Certification details
  badgeUrl: string      // URL to certification badge
}
```

### Course Object

```javascript
{
  id: string,      // Unique identifier
  name: string,    // Course name
  platform?: string // Optional platform name
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several properties were identified as redundant:
- Properties 6.2, 6.3, and 6.4 are subsumed by property 5.4 (all test project detail page content)
- Property 9.4 is redundant with 9.2 (both test route-to-page rendering)

These redundant properties have been consolidated into comprehensive properties below.

### Correctness Properties

Property 1: Data-driven skill rendering
*For any* skill object added to the skills data array, the About Page should automatically display that skill in the rendered output
**Validates: Requirements 4.4**

Property 2: Data-driven project rendering
*For any* project object added to the projects data array, the About Page should automatically render that project in the recent projects section
**Validates: Requirements 5.2**

Property 3: Project navigation consistency
*For any* project in the projects array, clicking "View Project" should navigate to a unique route that corresponds to that specific project
**Validates: Requirements 5.3, 6.1**

Property 4: Project detail page completeness
*For any* project, when its detail page loads, the page should display the project's image, external link, and detailed description
**Validates: Requirements 5.4, 6.2, 6.3, 6.4**

Property 5: Direct route navigation
*For any* valid project route, navigating directly to that route should render the correct project information on the detail page
**Validates: Requirements 6.5**

Property 6: Certification badge button presence
*For any* certification object that contains a badgeUrl property, the Education Page should display a button with a link to that badge URL
**Validates: Requirements 7.3**

Property 7: Badge link opens in new tab
*For any* certification badge button, clicking it should open the badge link in a new tab or window
**Validates: Requirements 7.4**

Property 8: Data-driven education rendering
*For any* education or certification object added to their respective data arrays, the Education Page should automatically render that item
**Validates: Requirements 7.5**

Property 9: Data-driven course rendering
*For any* course object added to the courses data array, the Education Page should automatically display that course in the online courses section
**Validates: Requirements 8.2**

Property 10: Route-to-page mapping
*For any* valid route in the application (/, /about, /education, /projects/:id), navigating to that route should render the corresponding page component
**Validates: Requirements 9.2, 9.4**

## Error Handling

### Invalid Project Routes

When a user navigates to a project detail route with an invalid or non-existent project ID:
- Display a "Project Not Found" message
- Provide a link to return to the About page
- Log the invalid route attempt for debugging

### Missing Data

When data arrays are empty or undefined:
- Render empty state messages (e.g., "No projects to display")
- Prevent rendering errors by providing default empty arrays
- Ensure the page layout remains intact

### Missing Badge URLs

When a certification object lacks a badgeUrl property:
- Do not render the badge button for that certification
- Still display all other certification information
- Ensure consistent spacing and layout

### Broken External Links

When external project links or badge URLs are invalid:
- Links should still be clickable (browser will handle the error)
- Consider adding visual indicators for external links
- No special error handling needed at the application level

## Testing Strategy

### Unit Testing

The application will use **Vitest** and **React Testing Library** for unit testing. Unit tests will cover:

**Component Rendering:**
- Navigation displays "Minh Ngo" text
- Home Page displays code block with specified skills (Java, Spring, Microservice, AWS, DevOps)
- About Page displays biography content with key phrases
- About Page displays exactly the specified skills (AWS, Java Spring, DevOps, Docker, Kubernetes, Microservice)
- Download CV button has correct link attribute
- App component renders without errors when components are properly imported
- Routes are configured for Home, About, Education, and Project Detail pages
- Browser back/forward navigation works correctly

**Edge Cases:**
- Project Detail Page handles invalid project IDs gracefully
- Empty data arrays render without errors
- Missing badgeUrl properties don't break certification rendering

### Property-Based Testing

The application will use **fast-check** for property-based testing in JavaScript/React. Each property-based test will:
- Run a minimum of 100 iterations
- Be tagged with a comment referencing the correctness property from this design document
- Use the format: `**Feature: portfolio-refactor, Property {number}: {property_text}**`

Property-based tests will verify:

1. **Data-driven rendering properties** - For any valid data object added to skills, projects, education, certifications, or courses arrays, the corresponding page should render that item
2. **Navigation properties** - For any project, navigation to its detail page should work correctly and display complete information
3. **Route mapping properties** - For any valid route, the application should render the correct page component
4. **Badge button properties** - For any certification with a badge URL, the button should be present and configured correctly

### Integration Testing

Integration tests will verify:
- Complete user flows (Home → About → Project Detail)
- Data flow from data files to rendered components
- Router integration with all page components

### Test Organization

Tests will be co-located with components using the `.test.jsx` suffix:
```
src/
├── components/
│   ├── Navigation.jsx
│   ├── Navigation.test.jsx
│   ├── ProjectCard.jsx
│   └── ProjectCard.test.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── HomePage.test.jsx
│   ├── AboutPage.jsx
│   ├── AboutPage.test.jsx
│   ├── EducationPage.jsx
│   ├── EducationPage.test.jsx
│   ├── ProjectDetailPage.jsx
│   └── ProjectDetailPage.test.jsx
```

## Implementation Notes

### React Router Setup

Install React Router: `npm install react-router-dom`

The main App component will use `BrowserRouter` and define routes using the `Routes` and `Route` components.

### Data File Structure

Data files will export JavaScript arrays/objects that can be easily imported by components. This allows for:
- Easy content updates without touching component code
- Potential future migration to a CMS or API
- Type safety if TypeScript is added later

### Styling Consistency

All new components and pages will maintain the existing Tailwind CSS styling:
- Dark theme with slate colors
- Blue accent color (#3B82F6)
- Consistent spacing and typography
- Responsive design with mobile-first approach

### Code Block Styling

The Java-style code block on the Home Page will use:
- Monospace font (font-mono)
- Syntax highlighting colors matching the existing design
- Java syntax elements (class declaration, public static, etc.)
- Proper indentation and formatting

### Performance Considerations

- Use React.lazy() for code splitting if bundle size becomes an issue
- Optimize images in the projects data
- Consider memoization for expensive rendering operations
- Keep data arrays reasonably sized for client-side rendering
