# Requirements Document

## Introduction

This feature adds blog functionality to the existing portfolio website, allowing users to read blog posts written in Markdown format. The system will display a blog listing page and individual blog detail pages with proper navigation integration.

## Glossary

- **Blog System**: The complete blog functionality including listing and detail views
- **Blog Post**: Individual markdown files stored in the public/blogs directory
- **Blog Metadata**: YAML frontmatter containing id, description, author, and time
- **Blog Listing Page**: Page displaying all available blog posts with titles and metadata
- **Blog Detail Page**: Page displaying the full content of a specific blog post
- **React Markdown**: Library for rendering markdown content as React components

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to access blog content through navigation, so that I can easily discover and read blog posts.

#### Acceptance Criteria

1. WHEN a user views the navigation menu THEN the system SHALL display a "Blog" link alongside existing navigation items
2. WHEN a user clicks the Blog navigation link THEN the system SHALL navigate to the blog listing page at route "/blog"
3. WHEN the blog listing page loads THEN the system SHALL display all available blog posts with their titles and metadata
4. WHEN a user clicks on a blog post title THEN the system SHALL navigate to the blog detail page at route "/blogs/{id}"

### Requirement 2

**User Story:** As a website visitor, I want to view a list of all blog posts, so that I can choose which posts to read.

#### Acceptance Criteria

1. WHEN the blog listing page loads THEN the system SHALL scan the public/blogs directory for markdown files
2. WHEN processing blog files THEN the system SHALL extract metadata from YAML frontmatter including id, description, author, and time
3. WHEN displaying blog posts THEN the system SHALL show the title, author, publication time, estimated reading time, and description for each post
4. WHEN no blog files exist THEN the system SHALL display an appropriate message indicating no posts are available
5. WHEN blog files contain invalid metadata THEN the system SHALL handle errors gracefully and skip invalid posts

### Requirement 3

**User Story:** As a website visitor, I want to read individual blog posts in a formatted view, so that I can consume the full content comfortably.

#### Acceptance Criteria

1. WHEN a user navigates to a blog detail page THEN the system SHALL load the corresponding markdown file based on the id parameter
2. WHEN rendering blog content THEN the system SHALL use react-markdown to convert markdown to HTML components
3. WHEN displaying the blog post THEN the system SHALL show the title, author, publication time, estimated reading time, and full formatted content
4. WHEN the blog id does not exist THEN the system SHALL display a 404 error message
5. WHEN markdown parsing fails THEN the system SHALL display an error message and fallback content

### Requirement 4

**User Story:** As a content creator, I want the system to automatically determine blog IDs, so that I can organize blog files consistently.

#### Acceptance Criteria

1. WHEN processing blog files THEN the system SHALL first check for an id field in the YAML frontmatter
2. WHEN no id exists in frontmatter THEN the system SHALL extract the id from the filename before the first dot
3. WHEN a filename is "1.Resolution_for_2026.md" THEN the system SHALL use "1" as the blog id
4. WHEN multiple blogs have the same id THEN the system SHALL handle the conflict by using the first encountered post
5. WHEN a blog file has no valid id source THEN the system SHALL skip that file and log an appropriate warning

### Requirement 5

**User Story:** As a website visitor, I want blog pages to maintain the same visual design as the rest of the site, so that I have a consistent user experience.

#### Acceptance Criteria

1. WHEN viewing blog pages THEN the system SHALL use the same navigation, footer, and styling as other pages
2. WHEN displaying blog content THEN the system SHALL apply appropriate Tailwind CSS classes for typography and spacing
3. WHEN rendering markdown elements THEN the system SHALL style headings, paragraphs, links, and other elements consistently with the site theme
4. WHEN viewing on mobile devices THEN the system SHALL ensure blog pages are fully responsive
5. WHEN blog content contains code blocks or special formatting THEN the system SHALL render them with appropriate styling

### Requirement 6

**User Story:** As a website visitor, I want to see estimated reading time for blog posts, so that I can plan my reading time accordingly.

#### Acceptance Criteria

1. WHEN processing blog content THEN the system SHALL calculate basic reading time using standard 200 words per minute
2. WHEN processing blog content THEN the system SHALL calculate advanced reading time considering images, code blocks, and content complexity
3. WHEN displaying blog posts THEN the system SHALL show the formatted reading time (e.g., "5 min read", "1h 30m read")
4. WHEN blog content contains code blocks THEN the system SHALL account for slower reading speed in time calculation
5. WHEN blog content contains images THEN the system SHALL add additional viewing time to the reading estimate