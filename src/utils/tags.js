/**
 * Blog post tags enumeration
 * Provides a centralized list of available tags for blog posts
 */

export const TAGS = {
  JAVA: 'Java',
  SPRING: 'Spring',
  AWS: 'AWS',
  CLOUD: 'Cloud',
  AI: 'AI',
  LEARNING: 'Learning',
  LIFE: 'Life'
};

/**
 * Get all available tags as an array
 * @returns {string[]} Array of all tag values
 */
export const getAllTags = () => Object.values(TAGS);

/**
 * Validate if a tag exists in the enum
 * @param {string} tag - Tag to validate
 * @returns {boolean} True if tag exists
 */
export const isValidTag = (tag) => Object.values(TAGS).includes(tag);

/**
 * Get tag by key (case insensitive)
 * @param {string} key - Tag key to lookup
 * @returns {string|null} Tag value or null if not found
 */
export const getTagByKey = (key) => {
  const upperKey = key.toUpperCase();
  return TAGS[upperKey] || null;
};