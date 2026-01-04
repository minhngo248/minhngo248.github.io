/**
 * Blog utility functions for processing markdown files and metadata extraction
 */

import { blogFiles } from '../data/blogFiles.js';

/**
 * Scans the public/blogs directory for markdown files
 * @returns {Promise<string[]>} Array of blog filenames
 */
export async function scanBlogFiles() {
  try {
    // In a browser environment, we can't directly scan directories
    // We use a pre-generated list of blog files created at build time
    // To update this list, run: npm run generate-files
    const blogFileList = [];
    
    // Use the auto-generated list from build time
    const possibleFiles = blogFiles;
    
    // First, check if the blogs directory exists by trying to fetch a known file
    if (possibleFiles.length === 0) {
      console.warn('No blog files configured for scanning');
      return [];
    }
    
    for (const filename of possibleFiles) {
      try {
        const response = await fetch(`/blogs/${filename}`);
        if (response.ok) {
          blogFileList.push(filename);
        } else if (response.status === 404) {
          console.info(`Blog file ${filename} not found (404)`);
        } else {
          console.warn(`Blog file ${filename} returned status ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        // Handle network errors, CORS issues, etc.
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.warn(`Network error fetching ${filename}:`, error.message);
        } else {
          console.warn(`Unexpected error fetching ${filename}:`, error.message);
        }
      }
    }
    
    return blogFileList;
  } catch (error) {
    console.error('Error scanning blog files:', error);
    throw new BlogError('Failed to scan blog directory. The blogs directory may not exist or be accessible.', error, 'DIRECTORY_ERROR');
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
      throw new BlogError('Invalid content provided for metadata extraction');
    }

    // Handle empty content
    if (content.trim().length === 0) {
      console.warn('Empty content provided for metadata extraction');
      return {
        id: null,
        description: '',
        author: '',
        time: '',
        title: '',
        content: ''
      };
    }

    // Check if content starts with frontmatter delimiter
    if (!content.startsWith('---')) {
      // No frontmatter, treat entire content as markdown
      let title = '';
      const titleMatch = content.match(/^#\s+(.+)$/m) || 
                        content.match(/<h1[^>]*>(.+?)<\/h1>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/align="center"/g, '').trim();
      }

      return {
        id: null,
        description: '',
        author: '',
        time: '',
        title: title,
        content: content.trim()
      };
    }

    // Find the end of frontmatter
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      throw new BlogError('Malformed frontmatter: missing closing delimiter. Expected "---" to close frontmatter block.', null, 'MALFORMED_FRONTMATTER');
    }

    // Extract frontmatter and content
    const frontmatterText = content.slice(3, frontmatterEnd).trim();
    const markdownContent = content.slice(frontmatterEnd + 3).trim();

    // Parse YAML frontmatter manually (simple key-value pairs)
    const metadata = {};
    const lines = frontmatterText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
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
            // Parse array format: [tag1, tag2, tag3]
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
          // Remove quotes if present for string values
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
        }
        
        // Validate key format
        if (key.length === 0) {
          console.warn(`Empty key found in frontmatter at line ${i + 1}`);
          continue;
        }
        
        metadata[key] = value;
      } else {
        console.warn(`Invalid frontmatter line format at line ${i + 1}: "${trimmedLine}"`);
      }
    }

    // Extract title from markdown content (first h1)
    let title = '';
    try {
      const titleMatch = markdownContent.match(/^#\s+(.+)$/m) || 
                        markdownContent.match(/<h1[^>]*>(.+?)<\/h1>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/align="center"/g, '').trim();
      }
    } catch (titleError) {
      console.warn('Error extracting title from markdown content:', titleError.message);
    }

    return {
      id: metadata.id || null,
      description: metadata.description || '',
      author: metadata.author || '',
      time: metadata.time || '',
      tags: metadata.tags || [],
      title: title,
      content: markdownContent
    };
  } catch (error) {
    if (error instanceof BlogError) {
      throw error;
    }
    console.error('Error extracting metadata:', error);
    throw new BlogError('Failed to extract metadata from content. The file may be corrupted or have invalid formatting.', error, 'METADATA_EXTRACTION_ERROR');
  }
}

/**
 * Determines blog ID from metadata or filename
 * @param {Object} metadata - Extracted metadata object
 * @param {string} filename - Original filename
 * @returns {string} Blog ID
 */
export function getBlogId(metadata, filename) {
  try {
    // First check for ID in frontmatter
    if (metadata && metadata.id) {
      return String(metadata.id);
    }

    // Fall back to extracting ID from filename (before first dot)
    if (filename) {
      const dotIndex = filename.indexOf('.');
      if (dotIndex > 0) {
        return filename.slice(0, dotIndex);
      }
    }

    throw new BlogError('No valid ID source found in metadata or filename');
  } catch (error) {
    if (error instanceof BlogError) {
      throw error;
    }
    console.error('Error determining blog ID:', error);
    throw new BlogError('Failed to determine blog ID', error);
  }
}

/**
 * Loads and processes individual blog file content
 * @param {string} filename - Blog filename
 * @returns {Promise<Object>} Processed blog post object
 */
export async function loadBlogContent(filename) {
  try {
    if (!filename) {
      throw new BlogError('Filename is required');
    }

    // Validate filename format
    if (typeof filename !== 'string' || filename.trim().length === 0) {
      throw new BlogError('Invalid filename format');
    }

    // Sanitize filename to prevent path traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    if (sanitizedFilename !== filename) {
      console.warn(`Filename sanitized from "${filename}" to "${sanitizedFilename}"`);
    }

    const response = await fetch(`/blogs/${sanitizedFilename}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new BlogError(`Blog file not found: ${filename}`, null, 'NOT_FOUND');
      } else if (response.status === 403) {
        throw new BlogError(`Access denied to blog file: ${filename}`, null, 'ACCESS_DENIED');
      } else if (response.status >= 500) {
        throw new BlogError(`Server error loading blog file: ${filename} (${response.status})`, null, 'SERVER_ERROR');
      } else {
        throw new BlogError(`Failed to fetch blog file: ${response.statusText} (${response.status})`, null, 'FETCH_ERROR');
      }
    }

    let content;
    try {
      content = await response.text();
    } catch (textError) {
      throw new BlogError(`Failed to read blog file content: ${filename}`, textError, 'CONTENT_READ_ERROR');
    }

    // Validate content is not empty
    if (!content || content.trim().length === 0) {
      throw new BlogError(`Blog file is empty: ${filename}`, null, 'EMPTY_FILE');
    }

    let metadata;
    try {
      metadata = extractMetadata(content);
    } catch (metadataError) {
      // If metadata extraction fails, create a fallback blog post
      console.warn(`Metadata extraction failed for ${filename}, using fallback:`, metadataError.message);
      metadata = {
        id: null,
        title: `Blog Post from ${filename}`,
        author: 'Unknown',
        time: '',
        description: 'This blog post has formatting issues but is still readable.',
        tags: [],
        content: content
      };
    }

    let id;
    try {
      id = getBlogId(metadata, filename);
    } catch (idError) {
      console.warn(`ID extraction failed for ${filename}, using filename:`, idError.message);
      // Fallback to using filename without extension
      id = filename.replace(/\.[^/.]+$/, '');
    }

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
      id,
      title: metadata.title || `Blog Post ${id}`,
      author: metadata.author || 'Unknown',
      time: metadata.time || '',
      description: metadata.description || '',
      tags: metadata.tags || [],
      content: metadata.content || '',
      filename,
      readingTime: basicReadingTime,
      advancedReadingTime: advancedReadingTime,
      readingTimeFormatted: readingTimeFormatted
    };
  } catch (error) {
    if (error instanceof BlogError) {
      throw error;
    }
    console.error('Error loading blog content:', error);
    throw new BlogError(`Failed to load blog content: ${filename}`, error, 'LOAD_ERROR');
  }
}

/**
 * Loads all blog posts with metadata
 * @returns {Promise<Object[]>} Array of blog post objects
 */
export async function loadAllBlogs() {
  try {
    let filenames;
    try {
      filenames = await scanBlogFiles();
    } catch (scanError) {
      // If scanning fails completely, return empty array with warning
      console.warn('Blog directory scanning failed:', scanError.message);
      if (scanError.code === 'DIRECTORY_ERROR') {
        throw new BlogError('Blog directory is not accessible. Please check that the /public/blogs directory exists and contains blog files.', scanError, 'DIRECTORY_NOT_ACCESSIBLE');
      }
      throw scanError;
    }

    if (filenames.length === 0) {
      console.info('No blog files found');
      return [];
    }

    const blogs = [];
    const seenIds = new Set();
    const errors = [];

    for (const filename of filenames) {
      try {
        const blog = await loadBlogContent(filename);
        
        // Handle ID conflicts by using first encountered post
        if (seenIds.has(blog.id)) {
          console.warn(`Duplicate blog ID ${blog.id} found in ${filename}, skipping`);
          errors.push(`Duplicate ID ${blog.id} in ${filename}`);
          continue;
        }
        
        seenIds.add(blog.id);
        blogs.push(blog);
      } catch (error) {
        const errorMessage = `Failed to load ${filename}: ${error.message}`;
        console.warn(errorMessage);
        errors.push(errorMessage);
        
        // Continue processing other files unless it's a critical error
        if (error.code === 'DIRECTORY_NOT_ACCESSIBLE') {
          throw error;
        }
      }
    }

    // Log summary of errors if any occurred
    if (errors.length > 0) {
      console.warn(`Blog loading completed with ${errors.length} error(s):`, errors);
    }

    return blogs;
  } catch (error) {
    console.error('Error loading all blogs:', error);
    if (error instanceof BlogError) {
      throw error;
    }
    throw new BlogError('Failed to load blog posts. There may be issues with the blog directory or file permissions.', error, 'LOAD_ALL_ERROR');
  }
}

/**
 * Finds a blog post by ID
 * @param {string} id - Blog ID to search for
 * @returns {Promise<Object|null>} Blog post object or null if not found
 */
export async function findBlogById(id) {
  try {
    if (!id) {
      throw new BlogError('Blog ID is required');
    }

    const blogs = await loadAllBlogs();
    return blogs.find(blog => blog.id === String(id)) || null;
  } catch (error) {
    console.error('Error finding blog by ID:', error);
    throw new BlogError('Failed to find blog post', error);
  }
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
    
    if (remainingMinutes === 0) return `${hours}h read`;
    return `${hours}h ${remainingMinutes}m read`;
  } catch (error) {
    console.warn('Error formatting reading time:', error.message);
    return "1 min read"; // Fallback
  }
}

/**
 * Custom error class for blog operations
 */
export class BlogError extends Error {
  constructor(message, cause = null, code = 'BLOG_ERROR') {
    super(message);
    this.name = 'BlogError';
    this.cause = cause;
    this.code = code;
  }
}

/**
 * Sorts blogs by date (most recent first by default)
 * @param {Object[]} blogs - Array of blog objects
 * @param {string} order - 'newest' or 'oldest'
 * @returns {Object[]} Sorted array of blogs
 */
export function sortBlogsByDate(blogs, order = 'newest') {
  try {
    if (!Array.isArray(blogs)) {
      console.warn('Invalid blogs array provided for sorting');
      return [];
    }

    return [...blogs].sort((a, b) => {
      const dateA = new Date(a.time || 0);
      const dateB = new Date(b.time || 0);
      
      if (order === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA; // newest first (default)
    });
  } catch (error) {
    console.warn('Error sorting blogs by date:', error.message);
    return blogs;
  }
}

/**
 * Filters blogs by search query (title and description)
 * @param {Object[]} blogs - Array of blog objects
 * @param {string} query - Search query
 * @returns {Object[]} Filtered array of blogs
 */
export function filterBlogsBySearch(blogs, query) {
  try {
    if (!Array.isArray(blogs)) {
      console.warn('Invalid blogs array provided for search filtering');
      return [];
    }

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return blogs;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return blogs.filter(blog => {
      const title = (blog.title || '').toLowerCase();
      const description = (blog.description || '').toLowerCase();
      
      return title.includes(searchTerm) || description.includes(searchTerm);
    });
  } catch (error) {
    console.warn('Error filtering blogs by search:', error.message);
    return blogs;
  }
}

/**
 * Filters blogs by tags
 * @param {Object[]} blogs - Array of blog objects
 * @param {string[]} selectedTags - Array of selected tag names
 * @returns {Object[]} Filtered array of blogs
 */
export function filterBlogsByTags(blogs, selectedTags) {
  try {
    if (!Array.isArray(blogs)) {
      console.warn('Invalid blogs array provided for tag filtering');
      return [];
    }

    if (!Array.isArray(selectedTags) || selectedTags.length === 0) {
      return blogs;
    }

    return blogs.filter(blog => {
      const blogTags = blog.tags || [];
      return selectedTags.some(selectedTag => 
        blogTags.some(blogTag => 
          blogTag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    });
  } catch (error) {
    console.warn('Error filtering blogs by tags:', error.message);
    return blogs;
  }
}

/**
 * Gets all unique tags from blogs
 * @param {Object[]} blogs - Array of blog objects
 * @returns {string[]} Array of unique tags
 */
export function getAllTagsFromBlogs(blogs) {
  try {
    if (!Array.isArray(blogs)) {
      console.warn('Invalid blogs array provided for tag extraction');
      return [];
    }

    const allTags = new Set();
    
    blogs.forEach(blog => {
      if (Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allTags.add(tag);
          }
        });
      }
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.warn('Error extracting tags from blogs:', error.message);
    return [];
  }
}