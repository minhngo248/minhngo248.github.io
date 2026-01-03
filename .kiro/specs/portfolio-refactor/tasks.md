# Implementation Plan

- [x] 1. Install and configure React Router





  - Install react-router-dom package
  - Set up BrowserRouter in main.jsx
  - _Requirements: 9.1_

- [x] 2. Create data files with portfolio content







  - [x] 2.1 Create data/skills.js with skills array

    - Export array of skill objects for About Page
    - Include: AWS, Java Spring, DevOps, Docker, Kubernetes, Microservice

    - _Requirements: 4.2_

  - [x] 2.2 Create data/projects.js with projects array

    - Export array of project objects with id, title, description, detailedDescription, technologies, image, and link
    - Include sample projects with complete data for testing
    - _Requirements: 5.1, 5.4_

  - [x] 2.3 Create data/education.js with education and courses arrays


    - Export education array with degree, institution, year, description
    - Export courses array with course names
    - _Requirements: 7.1, 8.1_




  - [x] 2.4 Create data/certifications.js with certifications array

    - Export array of certification objects with id, name, issuer, date, description, and badgeUrl
    - _Requirements: 7.2, 7.3_

- [x] 3. Create reusable components




  - [x] 3.1 Create components/Navigation.jsx


    - Implement navigation bar with "Minh Ngo" branding
    - Add Links to Home, About, and Education pages
    - Include mobile menu toggle functionality
    - _Requirements: 1.1, 2.1_


  - [x] 3.2 Create components/MobileMenu.jsx

    - Implement mobile menu with navigation links
    - Accept isOpen and onClose props
    - _Requirements: 1.2_

  - [x] 3.3 Create components/Footer.jsx


    - Extract footer from main App component
    - Maintain existing social links and styling
    - _Requirements: 1.6_



  - [x] 3.4 Create components/ProjectCard.jsx





    - Create reusable project card component
    - Accept project object and showLink props
    - Display title, description, technologies, and optional "View Project" link
    - _Requirements: 5.2_

- [ ]* 3.5 Write unit tests for Navigation component
    - Test that "Minh Ngo" text is displayed
    - Test navigation links are present
    - _Requirements: 2.1_

- [ ]* 3.6 Write unit tests for ProjectCard component
    - Test project data renders correctly
    - Test "View Project" link appears when showLink is true
    - _Requirements: 5.2_

- [x] 4. Create Home Page component




  - [x] 4.1 Create pages/HomePage.jsx


    - Implement hero section with introduction
    - Add "Learn More" button that navigates to About page
    - Add "Download CV" button with static CV link
    - _Requirements: 1.3, 3.4_

  - [x] 4.2 Implement Java-style code block in HomePage

    - Create code block in hidden md:block div
    - Format content in Java syntax style (class, public static, etc.)
    - Include skills: Java, Spring, Microservice, AWS, DevOps
    - _Requirements: 3.1, 3.2_

- [ ]* 4.3 Write unit tests for HomePage
    - Test code block displays with specified skills
    - Test Download CV button has correct link
    - _Requirements: 3.2, 3.4_

- [x] 5. Create About Page component





  - [x] 5.1 Create pages/AboutPage.jsx


    - Implement biography section with personalized content about Minh
    - Include content about Cloud native, DevOps, and scalable applications
    - _Requirements: 1.4, 4.1_

  - [x] 5.2 Implement data-driven skills section in AboutPage

    - Import skills array from data/skills.js
    - Map over skills array to render skill badges
    - _Requirements: 4.2, 4.4_


  - [x] 5.3 Implement data-driven projects section in AboutPage




    - Import projects array from data/projects.js
    - Use ProjectCard component to render each project
    - Add Link to project detail page for each project
    - _Requirements: 5.1, 5.2, 5.3_

- [ ]* 5.4 Write property test for data-driven skill rendering
    - **Property 1: Data-driven skill rendering**
    - **Validates: Requirements 4.4**

- [ ]* 5.5 Write property test for data-driven project rendering
    - **Property 2: Data-driven project rendering**
    - **Validates: Requirements 5.2**

- [ ]* 5.6 Write unit tests for AboutPage
    - Test biography content contains key phrases
    - Test exactly specified skills are displayed
    - _Requirements: 4.1, 4.2_

- [x] 6. Create Education Page component





  - [x] 6.1 Create pages/EducationPage.jsx


    - Import education, certifications, and courses arrays
    - _Requirements: 1.5_

  - [x] 6.2 Implement data-driven education section

    - Map over education array to render education items
    - Display degree, institution, year, and description
    - _Requirements: 7.1, 7.5_

  - [x] 6.3 Implement data-driven certifications section

    - Map over certifications array to render certification items
    - Display name, issuer, date, and description
    - Add button with link to badgeUrl when present
    - Configure badge links to open in new tab
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [x] 6.4 Implement data-driven courses section

    - Map over courses array to render course items
    - Maintain existing grid layout
    - _Requirements: 8.1, 8.2_

- [ ]* 6.5 Write property test for certification badge buttons
    - **Property 6: Certification badge button presence**
    - **Validates: Requirements 7.3**

- [ ]* 6.6 Write property test for badge link target
    - **Property 7: Badge link opens in new tab**
    - **Validates: Requirements 7.4**

- [ ]* 6.7 Write property test for data-driven education rendering
    - **Property 8: Data-driven education rendering**
    - **Validates: Requirements 7.5**

- [ ]* 6.8 Write property test for data-driven course rendering
    - **Property 9: Data-driven course rendering**
    - **Validates: Requirements 8.2**

- [x] 7. Create Project Detail Page component




  - [x] 7.1 Create pages/ProjectDetailPage.jsx


    - Use useParams hook to get project ID from route
    - Import projects array and find matching project
    - Display project image, external link, and detailed description
    - Handle invalid project IDs with "Project Not Found" message
    - _Requirements: 5.4, 6.2, 6.3, 6.4, 6.5_

- [ ]* 7.2 Write property test for project navigation consistency
    - **Property 3: Project navigation consistency**
    - **Validates: Requirements 5.3, 6.1**

- [ ]* 7.3 Write property test for project detail page completeness
    - **Property 4: Project detail page completeness**
    - **Validates: Requirements 5.4, 6.2, 6.3, 6.4**

- [ ]* 7.4 Write property test for direct route navigation
    - **Property 5: Direct route navigation**
    - **Validates: Requirements 6.5**

- [ ]* 7.5 Write unit tests for ProjectDetailPage
    - Test invalid project ID shows "Project Not Found"
    - Test project data displays correctly
    - _Requirements: 6.5_

- [x] 8. Configure routing in App component




  - [x] 8.1 Update App.jsx to use React Router


    - Import Routes, Route, and page components
    - Define routes for /, /about, /education, /projects/:projectId
    - Remove currentPage state management
    - Compose Navigation, Routes, and Footer components
    - _Requirements: 1.6, 9.1, 9.2_

- [ ]* 8.2 Write property test for route-to-page mapping
    - **Property 10: Route-to-page mapping**
    - **Validates: Requirements 9.2, 9.4**

- [ ]* 8.3 Write unit tests for routing configuration
    - Test all routes are configured correctly
    - Test browser back/forward navigation
    - _Requirements: 9.1, 9.3_

- [ ]* 8.4 Write integration tests for complete user flows
    - Test navigation from Home to About to Project Detail
    - Test data flows from data files to rendered components
    - _Requirements: 1.6, 9.2_

- [x] 9. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
