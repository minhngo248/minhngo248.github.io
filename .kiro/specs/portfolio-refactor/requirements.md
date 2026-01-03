# Requirements Document

## Introduction

This document outlines the requirements for refactoring and enhancing a personal portfolio website. The portfolio showcases Minh Ngo's backend development skills, projects, education, and certifications. The refactoring focuses on component separation, content personalization, dynamic data management, and adding project detail pages with routing.

## Glossary

- **Portfolio Application**: The React-based single-page application that displays Minh Ngo's professional portfolio
- **Navigation Component**: The top navigation bar that allows users to switch between pages
- **Home Page**: The landing page displaying an introduction and call-to-action buttons
- **About Page**: A page displaying biography, skills, and recent projects
- **Education Page**: A page displaying educational background, certifications, and online courses
- **Project Detail Page**: A dedicated page showing detailed information about a specific project
- **Data Array**: A JavaScript array of objects used to store structured content that can be rendered dynamically
- **Route**: A URL path that maps to a specific page or view in the application

## Requirements

### Requirement 1

**User Story:** As a developer maintaining the portfolio, I want the application separated into multiple component files, so that the codebase is more maintainable and follows React best practices.

#### Acceptance Criteria

1. WHEN the application loads THEN the Navigation component SHALL be defined in a separate file
2. WHEN the application loads THEN the Menu component SHALL be defined in a separate file
3. WHEN the application loads THEN the Home Page component SHALL be defined in a separate file
4. WHEN the application loads THEN the About Page component SHALL be defined in a separate file
5. WHEN the application loads THEN the Education Page component SHALL be defined in a separate file
6. WHEN components are separated THEN the main App component SHALL import and compose these components correctly

### Requirement 2

**User Story:** As Minh Ngo, I want my name displayed in the navigation instead of generic text, so that visitors immediately know whose portfolio they are viewing.

#### Acceptance Criteria

1. WHEN a user views the navigation bar THEN the Portfolio Application SHALL display "Minh Ngo" instead of "Backend Dev"
2. WHEN the navigation renders THEN the text "Minh Ngo" SHALL be styled consistently with the existing design

### Requirement 3

**User Story:** As Minh Ngo, I want the Home Page to showcase my specific backend skills in a Java-style code block, so that visitors can quickly see my technical expertise.

#### Acceptance Criteria

1. WHEN a user views the Home Page THEN the Portfolio Application SHALL display a code block in the hidden md:block div
2. WHEN the code block renders THEN the Portfolio Application SHALL include Java, Spring, Microservice, AWS, and DevOps in the skills array
3. WHEN the code block renders THEN the Portfolio Application SHALL format the content in Java syntax style
4. WHEN a user clicks the Download CV button THEN the Portfolio Application SHALL navigate to a static CV file link

### Requirement 4

**User Story:** As Minh Ngo, I want my About Page to contain personalized biographical information and curated skills, so that visitors understand my professional background and expertise.

#### Acceptance Criteria

1. WHEN a user views the About Page biography section THEN the Portfolio Application SHALL display content describing Minh as a backend developer with passion for Cloud native, DevOps, and scalable applications
2. WHEN a user views the skills section THEN the Portfolio Application SHALL display only AWS, Java Spring, DevOps, Docker, Kubernetes, and Microservice
3. WHEN the skills are rendered THEN the Portfolio Application SHALL generate them from a data array of skill objects
4. WHEN a new skill is added to the data array THEN the Portfolio Application SHALL automatically display it without code changes to the rendering logic

### Requirement 5

**User Story:** As Minh Ngo, I want my recent projects to be stored as data arrays, so that I can easily add or modify projects without changing component code.

#### Acceptance Criteria

1. WHEN the About Page renders recent projects THEN the Portfolio Application SHALL read project data from an array of project objects
2. WHEN a project object is added to the array THEN the Portfolio Application SHALL automatically render the new project
3. WHEN a user clicks "View Project" on any project THEN the Portfolio Application SHALL navigate to a Project Detail Page for that specific project
4. WHEN the Project Detail Page loads THEN the Portfolio Application SHALL display the project's image, link, and description

### Requirement 6

**User Story:** As a visitor, I want to view detailed information about specific projects, so that I can understand the scope and technical details of Minh's work.

#### Acceptance Criteria

1. WHEN a user clicks "View Project" THEN the Portfolio Application SHALL navigate to a unique route for that project
2. WHEN the Project Detail Page loads THEN the Portfolio Application SHALL display an image for the project
3. WHEN the Project Detail Page loads THEN the Portfolio Application SHALL display a clickable external link to the project
4. WHEN the Project Detail Page loads THEN the Portfolio Application SHALL display a detailed description of the project
5. WHEN a user navigates to a project detail route directly THEN the Portfolio Application SHALL render the correct project information

### Requirement 7

**User Story:** As Minh Ngo, I want my education and certifications stored as data arrays, so that I can easily update my credentials without modifying component rendering logic.

#### Acceptance Criteria

1. WHEN the Education Page renders THEN the Portfolio Application SHALL read education data from an array of education objects
2. WHEN the Education Page renders certifications THEN the Portfolio Application SHALL read certification data from an array of certification objects
3. WHEN a certification object contains a badge link THEN the Portfolio Application SHALL display a button that redirects to the static badge URL
4. WHEN a user clicks a certification badge button THEN the Portfolio Application SHALL open the badge link in a new tab or window
5. WHEN new education or certification objects are added to their arrays THEN the Portfolio Application SHALL automatically render them

### Requirement 8

**User Story:** As Minh Ngo, I want my online courses stored as a data array, so that I can maintain a current list of my continuous learning activities.

#### Acceptance Criteria

1. WHEN the Education Page renders online courses THEN the Portfolio Application SHALL read course data from an array of course objects
2. WHEN a course object is added to the array THEN the Portfolio Application SHALL automatically display the new course
3. WHEN the courses section renders THEN the Portfolio Application SHALL maintain the existing grid layout and styling

### Requirement 9

**User Story:** As a developer, I want proper routing implemented in the application, so that users can navigate between pages using browser history and bookmarkable URLs.

#### Acceptance Criteria

1. WHEN the application initializes THEN the Portfolio Application SHALL configure routes for Home, About, Education, and Project Detail pages
2. WHEN a user navigates to a route THEN the Portfolio Application SHALL render the corresponding page component
3. WHEN a user uses browser back/forward buttons THEN the Portfolio Application SHALL navigate between previously visited pages
4. WHEN a user bookmarks a URL THEN the Portfolio Application SHALL render the correct page when the bookmark is accessed
