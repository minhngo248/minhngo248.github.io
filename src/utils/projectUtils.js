/**
 * Project utility functions for processing markdown files and metadata extraction
 */

/**
 * Custom error class for project-related errors
 */
export class ProjectError extends Error {
  constructor(message, cause = null, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ProjectError';
    this.cause = cause;
    this.code = code;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProjectError);
    }
  }
}

/**
 * Scans the public/projects directory for markdown files
 * @returns {Promise<string[]>} Array of project filenames
 */
export async function scanProjectFiles() {
  try {
    const projectFiles = [];
    
    // List of project files - in production, this could be generated at build time
    const possibleFiles = [
      '1.Tourist_project.md',
      '2.Job_search.md',
      '3.Java_Stream.md',
      // Add more files as they are created
    ];
    
    if (possibleFiles.length === 0) {
      console.warn('No project files configured for scanning');
      return [];
    }
    
    for (const filename of possibleFiles) {
      try {
        const response = await fetch(`/projects/${filename}`);
        if (response.ok) {
          projectFiles.push(filename);
        } else if (response.status === 404) {
          console.info(`Project file ${filename} not found (404)`);
        } else {
          console.warn(`Project file ${filename} returned status ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.warn(`Network error fetching ${filename}:`, error.message);
        } else {
          console.warn(`Unexpected error fetching ${filename}:`, error.message);
        }
      }
    }
    
    return projectFiles;
  } catch (error) {
    console.error('Error scanning project files:', error);
    throw new ProjectError('Failed to scan project directory. The projects directory may not exist or be accessible.', error, 'DIRECTORY_ERROR');
  }
}

/**
 * Extracts metadata from YAML frontmatter in markdown content
 * @param {string} content - Raw markdown content with frontmatter
 * @returns {Object} Parsed metadata object
 */
export function extractMetadata(content) {
  try {
    if (!content || typeof content !== 'string') {
      throw new ProjectError('Invalid content provided for metadata extraction');
    }

    if (content.trim().length === 0) {
      console.warn('Empty content provided for metadata extraction');
      return {
        id: null,
        name: '',
        description: '',
        contributors: '',
        tags: [],
        time: '',
        content: ''
      };
    }

    if (!content.startsWith('---')) {
      let title = '';
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }

      return {
        id: null,
        name: title,
        description: '',
        contributors: '',
        tags: [],
        time: '',
        content: content.trim()
      };
    }

    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      throw new ProjectError('Malformed frontmatter: missing closing delimiter.', null, 'MALFORMED_FRONTMATTER');
    }

    const frontmatterText = content.slice(3, frontmatterEnd).trim();
    const markdownContent = content.slice(frontmatterEnd + 3).trim();

    const metadata = {};
    const lines = frontmatterText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      if (trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':');
        const key = trimmedLine.slice(0, colonIndex).trim();
        let value = trimmedLine.slice(colonIndex + 1).trim();
        
        // Handle arrays (tags)
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            const arrayContent = value.slice(1, -1).trim();
            if (arrayContent) {
              value = arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''));
            } else {
              value = [];
            }
          } catch (arrayError) {
            console.warn(`Error parsing array value for key "${key}":`, arrayError.message);
            value = [];
          }
        } else {
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
        }
        
        metadata[key] = value;
      }
    }

    return {
      id: metadata.id !== undefined ? String(metadata.id) : null,
      name: metadata.name || '',
      description: metadata.description || '',
      contributors: metadata.contributors || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      time: metadata.time || '',
      content: markdownContent
    };
  } catch (error) {
    if (error instanceof ProjectError) {
      throw error;
    }
    console.error('Unexpected error in extractMetadata:', error);
    throw new ProjectError('Failed to extract metadata from project content', error, 'METADATA_EXTRACTION_ERROR');
  }
}

/**
 * Loads a single project file and extracts its metadata
 * @param {string} filename - Name of the project markdown file
 * @returns {Promise<Object>} Project object with metadata and content
 */
export async function loadProjectFile(filename) {
  try {
    if (!filename || typeof filename !== 'string') {
      throw new ProjectError('Invalid filename provided');
    }

    const response = await fetch(`/projects/${filename}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ProjectError(`Project file not found: ${filename}`, null, 'NOT_FOUND');
      } else if (response.status === 403) {
        throw new ProjectError(`Access denied to project file: ${filename}`, null, 'ACCESS_DENIED');
      } else if (response.status >= 500) {
        throw new ProjectError(`Server error loading project: ${filename}`, null, 'SERVER_ERROR');
      } else {
        throw new ProjectError(`Failed to load project: ${response.status} ${response.statusText}`, null, 'LOAD_ERROR');
      }
    }

    const content = await response.text();
    
    if (!content || content.trim().length === 0) {
      throw new ProjectError(`Project file is empty: ${filename}`, null, 'EMPTY_FILE');
    }

    const metadata = extractMetadata(content);
    
    // Calculate reading times with error handling
    let basicReadingTime = 1;
    let advancedReadingTime = 1;
    let readingTimeFormatted = '1 min read';

    try {
      basicReadingTime = calculateReadingTime(metadata.content);
      advancedReadingTime = calculateAdvancedReadingTime(metadata.content);
      readingTimeFormatted = formatReadingTime(advancedReadingTime);
    } catch (readingTimeError) {
      console.warn(`Reading time calculation failed for ${filename}:`, readingTimeError.message);
    }
    
    return {
      filename,
      ...metadata,
      basicReadingTime,
      advancedReadingTime,
      readingTimeFormatted
    };
  } catch (error) {
    if (error instanceof ProjectError) {
      throw error;
    }
    console.error(`Error loading project file ${filename}:`, error);
    throw new ProjectError(`Failed to load project file: ${filename}`, error, 'LOAD_ERROR');
  }
}

/**
 * Loads all project files from the projects directory
 * @returns {Promise<Array>} Array of project objects
 */
export async function loadAllProjects() {
  try {
    const filenames = await scanProjectFiles();
    
    if (filenames.length === 0) {
      console.warn('No project files found in /projects directory');
      return [];
    }

    const projectPromises = filenames.map(filename => 
      loadProjectFile(filename).catch(error => {
        console.error(`Failed to load ${filename}:`, error.message);
        return null;
      })
    );

    const projects = await Promise.all(projectPromises);
    
    const validProjects = projects.filter(project => project !== null);
    
    if (validProjects.length === 0 && filenames.length > 0) {
      throw new ProjectError('All project files failed to load', null, 'LOAD_ALL_ERROR');
    }

    return validProjects;
  } catch (error) {
    if (error instanceof ProjectError) {
      throw error;
    }
    console.error('Error loading all projects:', error);
    throw new ProjectError('Failed to load projects', error, 'LOAD_ALL_ERROR');
  }
}

/**
 * Finds a project by its ID
 * @param {string} id - Project ID to search for
 * @returns {Promise<Object|null>} Project object or null if not found
 */
export async function findProjectById(id) {
  try {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      throw new ProjectError('Invalid project ID provided');
    }

    const idString = String(id);
    const projects = await loadAllProjects();
    
    const project = projects.find(p => String(p.id) === idString);
    
    if (!project) {
      throw new ProjectError(`Project with ID "${id}" not found`, null, 'NOT_FOUND');
    }
    
    return project;
  } catch (error) {
    if (error instanceof ProjectError) {
      throw error;
    }
    console.error(`Error finding project by ID ${id}:`, error);
    throw new ProjectError(`Failed to find project with ID: ${id}`, error, 'FIND_ERROR');
  }
}

/**
 * Extracts all unique tags from an array of projects
 * @param {Array} projects - Array of project objects
 * @returns {Array} Array of unique tags sorted alphabetically
 */
export function getAllTagsFromProjects(projects) {
  if (!Array.isArray(projects)) {
    console.warn('getAllTagsFromProjects called with non-array:', typeof projects);
    return [];
  }

  const tagSet = new Set();
  
  projects.forEach(project => {
    if (project && Array.isArray(project.tags)) {
      project.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagSet.add(tag.trim());
        }
      });
    }
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Sorts projects by date
 * @param {Array} projects - Array of project objects
 * @param {string} order - Sort order: 'newest' or 'oldest'
 * @returns {Array} Sorted array of projects
 */
export function sortProjectsByDate(projects, order = 'newest') {
  if (!Array.isArray(projects)) {
    console.warn('sortProjectsByDate called with non-array:', typeof projects);
    return [];
  }

  const sorted = [...projects].sort((a, b) => {
    const dateA = a.time ? new Date(a.time) : new Date(0);
    const dateB = b.time ? new Date(b.time) : new Date(0);
    
    if (order === 'oldest') {
      return dateA - dateB;
    }
    return dateB - dateA;
  });
  
  return sorted;
}

/**
 * Filters projects by search query (name and description)
 * @param {Array} projects - Array of project objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered array of projects
 */
export function filterProjectsBySearch(projects, query) {
  if (!Array.isArray(projects)) {
    console.warn('filterProjectsBySearch called with non-array:', typeof projects);
    return [];
  }

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return projects;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return projects.filter(project => {
    const name = (project.name || '').toLowerCase();
    const description = (project.description || '').toLowerCase();
    
    return name.includes(searchTerm) || description.includes(searchTerm);
  });
}

/**
 * Filters projects by selected tags (OR logic - matches any tag)
 * @param {Array} projects - Array of project objects
 * @param {Array} selectedTags - Array of tag strings to filter by
 * @returns {Array} Filtered array of projects
 */
export function filterProjectsByTags(projects, selectedTags) {
  if (!Array.isArray(projects)) {
    console.warn('filterProjectsByTags called with non-array:', typeof projects);
    return [];
  }

  if (!Array.isArray(selectedTags) || selectedTags.length === 0) {
    return projects;
  }

  return projects.filter(project => {
    if (!project || !Array.isArray(project.tags)) {
      return false;
    }
    
    return project.tags.some(tag => selectedTags.includes(tag));
  });
}

/**
 * Calculates basic reading time based on word count
 * @param {string} content - The text content to analyze
 * @param {number} wpm - Words per minute (default: 200)
 * @returns {number} Reading time in minutes
 */
export function calculateReadingTime(content, wpm = 200) {
  try {
    if (!content || typeof content !== 'string') {
      console.warn('Invalid content provided for reading time calculation');
      return 1;
    }
    
    if (wpm <= 0) {
      console.warn('Invalid words per minute value, using default 200');
      wpm = 200;
    }
    
    // Remove markdown syntax for more accurate word count
    const plainText = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]*`/g, '') // Remove inline code
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
      .replace(/[#*_~]/g, '') // Remove markdown formatting
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    if (plainText.length === 0) {
      return 1;
    }
    
    const words = plainText.split(' ').filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / wpm);
    
    return Math.max(1, minutes); // Minimum 1 minute
  } catch (error) {
    console.warn('Error calculating reading time:', error.message);
    return 1; // Fallback to 1 minute
  }
}

/**
 * Calculates advanced reading time considering images, code blocks, and content complexity
 * @param {string} content - The text content to analyze
 * @param {number} wpm - Words per minute for regular text (default: 200)
 * @returns {number} Reading time in minutes
 */
export function calculateAdvancedReadingTime(content, wpm = 200) {
  try {
    if (!content || typeof content !== 'string') {
      console.warn('Invalid content provided for advanced reading time calculation');
      return 1;
    }
    
    if (wpm <= 0) {
      console.warn('Invalid words per minute value, using default 200');
      wpm = 200;
    }
    
    // Count images (add 12 seconds per image)
    let images = 0;
    try {
      images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    } catch (imageError) {
      console.warn('Error counting images:', imageError.message);
    }
    const imageTime = images * 12; // seconds
    
    // Count code blocks (slower reading)
    let codeBlocks = 0;
    let inlineCode = 0;
    try {
      codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
      inlineCode = (content.match(/`[^`]+`/g) || []).length;
    } catch (codeError) {
      console.warn('Error counting code blocks:', codeError.message);
    }
    
    // Estimate code block content (assume average 50 words per block)
    const codeBlockWords = codeBlocks * 50;
    const inlineCodeWords = inlineCode * 2; // shorter inline code
    
    // Get regular text word count (excluding code and images)
    let plainText = '';
    try {
      plainText = content
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[^`]*`/g, '') // Remove inline code
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links (keep text)
        .replace(/[#*_~]/g, '') // Remove markdown formatting
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    } catch (textError) {
      console.warn('Error processing text content:', textError.message);
      plainText = content; // Fallback to original content
    }
    
    const regularWords = plainText.split(' ').filter(word => word.length > 0).length;
    
    // Calculate reading times
    const regularReadingTime = regularWords / wpm;
    const codeReadingTime = (codeBlockWords + inlineCodeWords) / (wpm * 0.5); // Code reads slower
    const imageViewingTime = imageTime / 60; // Convert to minutes
    
    const totalMinutes = regularReadingTime + codeReadingTime + imageViewingTime;
    
    return Math.max(1, Math.ceil(totalMinutes)); // Minimum 1 minute
  } catch (error) {
    console.warn('Error calculating advanced reading time:', error.message);
    return 1; // Fallback to 1 minute
  }
}

/**
 * Formats reading time for display
 * @param {number} minutes - Reading time in minutes
 * @returns {string} Formatted reading time string
 */
export function formatReadingTime(minutes) {
  try {
    if (!minutes || typeof minutes !== 'number' || minutes < 1 || !isFinite(minutes)) {
      return "1 min read";
    }
    
    const roundedMinutes = Math.round(minutes);
    
    if (roundedMinutes === 1) return "1 min read";
    if (roundedMinutes < 60) return `${roundedMinutes} min read`;
    
    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = roundedMinutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h read`;
    }
    
    return `${hours}h ${remainingMinutes}m read`;
  } catch (error) {
    console.warn('Error formatting reading time:', error.message);
    return "1 min read";
  }
}
