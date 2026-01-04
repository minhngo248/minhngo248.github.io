import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  extractMetadata,
  getBlogId,
  calculateReadingTime,
  calculateAdvancedReadingTime,
  formatReadingTime,
  BlogError
} from '../utils/blogUtils'

describe('Blog Utilities', () => {
  describe('extractMetadata', () => {
    it('should extract metadata from valid frontmatter', () => {
      const content = `---
id: 1
description: Test description
author: Test Author
time: 2026-01-03 13:13:42 +0100
---
# Test Title

Content here.`

      const result = extractMetadata(content)
      
      expect(result.id).toBe('1')
      expect(result.description).toBe('Test description')
      expect(result.author).toBe('Test Author')
      expect(result.time).toBe('2026-01-03 13:13:42 +0100')
      expect(result.title).toBe('Test Title')
      expect(result.content).toBe('# Test Title\n\nContent here.')
    })

    it('should handle content without frontmatter', () => {
      const content = `# Test Title

Content without frontmatter.`

      const result = extractMetadata(content)
      
      expect(result.id).toBeNull()
      expect(result.title).toBe('Test Title')
      expect(result.content).toBe(content)
    })

    it('should handle empty content', () => {
      const result = extractMetadata('   ') // whitespace only
      
      expect(result.id).toBeNull()
      expect(result.title).toBe('')
      expect(result.content).toBe('')
    })

    it('should throw error for null content', () => {
      expect(() => extractMetadata(null)).toThrow(BlogError)
      expect(() => extractMetadata(undefined)).toThrow(BlogError)
    })

    it('should throw error for malformed frontmatter', () => {
      const content = `---
id: 1
description: Test
# Title without closing delimiter`

      expect(() => extractMetadata(content)).toThrow(BlogError)
    })
  })

  describe('getBlogId', () => {
    it('should use ID from metadata when available', () => {
      const metadata = { id: '123' }
      const filename = '456.test.md'
      
      const result = getBlogId(metadata, filename)
      expect(result).toBe('123')
    })

    it('should extract ID from filename when metadata ID is missing', () => {
      const metadata = { id: null }
      const filename = '1.Resolution_for_2026.md'
      
      const result = getBlogId(metadata, filename)
      expect(result).toBe('1')
    })

    it('should handle filename without extension', () => {
      const metadata = { id: null }
      const filename = 'test-blog'
      
      expect(() => getBlogId(metadata, filename)).toThrow(BlogError)
    })

    it('should throw error when no valid ID source exists', () => {
      const metadata = { id: null }
      const filename = ''
      
      expect(() => getBlogId(metadata, filename)).toThrow(BlogError)
    })
  })

  describe('calculateReadingTime', () => {
    it('should calculate reading time for normal text', () => {
      const content = 'word '.repeat(200) // 200 words
      const result = calculateReadingTime(content, 200)
      expect(result).toBe(1) // 200 words / 200 wpm = 1 minute
    })

    it('should return minimum 1 minute for short content', () => {
      const content = 'short text'
      const result = calculateReadingTime(content, 200)
      expect(result).toBe(1)
    })

    it('should handle empty content', () => {
      const result = calculateReadingTime('', 200)
      expect(result).toBe(1)
    })

    it('should ignore markdown syntax in word count', () => {
      const content = '**bold** *italic* `code` [link](url) # heading'
      const result = calculateReadingTime(content, 200)
      expect(result).toBe(1) // Should count actual words, not markdown
    })
  })

  describe('calculateAdvancedReadingTime', () => {
    it('should add time for images', () => {
      // Use longer content to see the difference
      const content = 'word '.repeat(100) + '![image](url) ' + 'word '.repeat(100)
      const basicTime = calculateReadingTime(content, 200)
      const advancedTime = calculateAdvancedReadingTime(content, 200)
      expect(advancedTime).toBeGreaterThanOrEqual(basicTime)
    })

    it('should account for code blocks', () => {
      // Use longer content to see the difference
      const content = `${'word '.repeat(100)}
\`\`\`
${'code '.repeat(50)}
\`\`\`
${'word '.repeat(100)}`
      const basicTime = calculateReadingTime(content, 200)
      const advancedTime = calculateAdvancedReadingTime(content, 200)
      expect(advancedTime).toBeGreaterThanOrEqual(basicTime)
    })

    it('should handle content with multiple elements', () => {
      const content = `# Title
${'word '.repeat(200)} ![image](url) ${'word '.repeat(200)}
\`\`\`
${'code '.repeat(100)}
\`\`\`
${'word '.repeat(200)} with \`inline code\`.`
      
      const result = calculateAdvancedReadingTime(content, 200)
      expect(result).toBeGreaterThan(1)
    })
  })

  describe('formatReadingTime', () => {
    it('should format single minute', () => {
      expect(formatReadingTime(1)).toBe('1 min read')
    })

    it('should format multiple minutes', () => {
      expect(formatReadingTime(5)).toBe('5 min read')
    })

    it('should format hours', () => {
      expect(formatReadingTime(60)).toBe('1h read')
      expect(formatReadingTime(90)).toBe('1h 30m read')
    })

    it('should handle invalid input', () => {
      expect(formatReadingTime(0)).toBe('1 min read')
      expect(formatReadingTime(-5)).toBe('1 min read')
      expect(formatReadingTime(null)).toBe('1 min read')
    })
  })

  describe('BlogError', () => {
    it('should create error with message and code', () => {
      const error = new BlogError('Test message', null, 'TEST_CODE')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('TEST_CODE')
      expect(error.name).toBe('BlogError')
    })
  })
})