# Blog Feature Design Document

## Overview

The blog feature extends the existing portfolio website with markdown-based blog functionality. It integrates seamlessly with the current React Router setup and maintains the existing design system. The feature consists of two main pages: a blog listing page that displays all available posts, and individual blog detail pages that render markdown content using react-markdown.

## Architecture

The blog system follows the existing architectural patterns:

- **Route-based pages**: BlogPage.jsx and BlogDetailPage.jsx in src/pages/
- **Static content**: Markdown files in public/blogs/ directory
- **Data processing**: Blog metadata extraction and file system operations
- **Navigation integration**: Updated Navigation.jsx and MobileMenu.jsx components

The system leverages the existing HashRouter configuration for GitHub Pages compatibility and maintains the current styling approach using Tailwind CSS.

## Components and Interfaces

### Navigation Updates
- Add "Blog" link to both desktop and mobile navigation menus
- Maintain existing styling and responsive behavior
- Route: `/blog`

### BlogPage Component
```jsx
// src/pages/BlogPage.jsx
- Fetches and displays list of all blog posts
- Shows title, author, date, and description for each post
- Provides clickable links to individual blog posts
- Handles loading states and error conditions
```

### BlogDetailPage Component
```jsx
// src/pages/BlogDetailPage.jsx  
- Accepts blog ID as URL parameter
- Fetches and renders individual blog post content
- Uses react-markdown for markdown-to-HTML conversion
- Displays metadata (title, author, date) and full content
- Handles 404 cases for non-existent blog IDs
```

### Blog Data Processing
```javascript
// Blog utility functions
- scanBlogFiles(): Discovers markdown files in public/blogs/
- extractMetadata(): Parses YAML frontmatter from markdown files
- getBlogId(): Determines blog ID from metadata or filename
- loadBlogContent(): Fetches and processes individual blog files
- calculateReadingTime(): Calculates basic reading time (200 WPM)
- calculateAdvancedReadingTime(): Advanced calculation considering images and code
- formatReadingTime(): Formats reading time for display
```

## Data Models

### Blog Post Structure
```javascript
{
  id: string,                    // From frontmatter or filename
  title: string,                 // Extracted from markdown content or metadata
  author: string,                // From frontmatter
  time: string,                  // ISO date string from frontmatter
  description: string,           // From frontmatter
  content: string,               // Full markdown content
  filename: string,              // Original filename for reference
  readingTime: number,           // Basic reading time in minutes
  advancedReadingTime: number,   // Advanced reading time in minutes
  readingTimeFormatted: string   // Formatted reading time (e.g., "5 min read")
}
```

### Blog Metadata (YAML Frontmatter)
```yaml
---
id: 1
description: "Blog post description"
author: "Author Name"
time: "2026-01-03 13:13:42 +0100"
---
```

## Correctness Properties
*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing the prework analysis, several properties can be consolidated:
- Properties 2.2, 2.3, and 3.3 all test metadata display and can be combined into a comprehensive metadata handling property
- Properties 4.1 and 4.2 test ID extraction logic and can be combined into a single ID resolution property
- Properties 5.2 and 5.3 both test styling consistency and can be combined

### Core Properties

**Property 1: Blog Discovery and Display**
*For any* set of valid markdown files in the public/blogs directory, the blog listing page should display all files with their extracted metadata (title, author, time, description)
**Validates: Requirements 1.3, 2.1, 2.2, 2.3**

**Property 2: Navigation Consistency**
*For any* blog post with a valid ID, clicking on the post title should navigate to the correct blog detail route "/blogs/{id}"
**Validates: Requirements 1.4**

**Property 3: Blog Content Loading**
*For any* valid blog ID, the blog detail page should load and display the corresponding markdown file with all metadata and formatted content
**Validates: Requirements 3.1, 3.2, 3.3**

**Property 4: ID Resolution Logic**
*For any* blog file, the system should determine the ID by first checking frontmatter, then falling back to the filename before the first dot
**Validates: Requirements 4.1, 4.2, 4.4**

**Property 5: Markdown Rendering Consistency**
*For any* valid markdown content, the react-markdown component should render all elements (headings, paragraphs, links, code blocks) with appropriate Tailwind CSS styling
**Validates: Requirements 5.2, 5.3, 5.5**

**Property 6: Layout Consistency**
*For any* blog page (listing or detail), the page should include the same navigation and footer components as other site pages
**Validates: Requirements 5.1**

**Property 7: Reading Time Calculation**
*For any* blog post with valid content, the system should calculate and display reading time that accounts for text, images, and code blocks with appropriate time estimates
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

## Error Handling

### File System Errors
- Handle cases where public/blogs directory doesn't exist
- Gracefully skip files that cannot be read or parsed
- Provide fallback content when blog files are missing

### Metadata Parsing Errors
- Skip blog files with malformed YAML frontmatter
- Provide default values for missing metadata fields
- Log warnings for files that cannot be processed

### Navigation Errors
- Display 404 page for non-existent blog IDs
- Handle malformed URLs gracefully
- Provide navigation back to blog listing from error states

### Markdown Rendering Errors
- Fallback to plain text if markdown parsing fails
- Handle special characters and encoding issues
- Sanitize user content to prevent XSS attacks

## Testing Strategy

### Unit Testing Approach
The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Test specific navigation examples (Blog link presence, route changes)
- Test edge cases like empty blog directories and non-existent blog IDs
- Test specific filename parsing examples (e.g., "1.Resolution_for_2026.md" → "1")
- Test error handling scenarios with malformed files

**Property-Based Testing:**
- Use **React Testing Library** with **fast-check** for property-based testing
- Configure each property-based test to run a minimum of 100 iterations
- Each property-based test must be tagged with: **Feature: blog-feature, Property {number}: {property_text}**
- Generate random blog files with various metadata combinations
- Test ID resolution across different filename patterns
- Verify markdown rendering with randomly generated content

**Integration Testing:**
- Test complete user flows from navigation to blog detail viewing
- Verify proper integration with existing routing system
- Test responsive behavior across different screen sizes

### Test Data Generation
- Generate blog files with various frontmatter combinations
- Create filename patterns to test ID extraction logic
- Generate markdown content with different formatting elements
- Test with empty directories and malformed files

## Implementation Dependencies

### New Dependencies
- **react-markdown**: For converting markdown to React components
- **gray-matter**: For parsing YAML frontmatter from markdown files (if needed)

### Existing Dependencies
- React Router DOM: For routing to blog pages
- Tailwind CSS: For styling blog content
- Lucide React: For any additional icons needed

### File Structure Changes
```
src/
├── pages/
│   ├── BlogPage.jsx          # New: Blog listing page
│   └── BlogDetailPage.jsx    # New: Individual blog post page
├── components/
│   ├── Navigation.jsx        # Updated: Add Blog link
│   └── MobileMenu.jsx        # Updated: Add Blog link
└── utils/
    └── blogUtils.js          # New: Blog processing utilities
```

### Route Configuration
- Add `/blog` route for blog listing page
- Add `/blogs/:id` route for individual blog posts
- Update App.jsx with new route definitions

## Performance Considerations

### Blog File Loading
- Implement lazy loading for blog content on detail pages
- Cache blog metadata to avoid repeated file system operations
- Consider implementing pagination for large numbers of blog posts

### Markdown Rendering
- Use react-markdown's built-in optimization features
- Consider code splitting for the markdown rendering component
- Implement proper error boundaries around markdown content

### SEO and Accessibility
- Ensure proper heading hierarchy in rendered markdown
- Add appropriate meta tags for blog posts
- Implement proper focus management for navigation
- Ensure all interactive elements are keyboard accessible