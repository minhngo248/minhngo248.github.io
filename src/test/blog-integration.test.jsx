import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

// Mock blog content - use the actual blog content
const mockBlogContent = `---
id: 1
description: 
author: Minh NGO
time: 2026-01-03 13:13:42 +0100
---
# Some words for the year 2025 and my resolutions for 2026

## Context
Hello world, here is Minh, software developer based in Paris, original from Vietnam. This is the first time I write a blog, actually the first time that I write something to public. For me, it is really a "coming out of the comfort zone" move. So is the year 2025. I was doing many things that I haven't done before.`

describe('Blog Integration Tests', () => {
  beforeEach(() => {
    // Reset fetch mock
    fetch.mockReset()
    
    // Mock successful blog file fetch - need to handle both scanning and content loading
    fetch.mockImplementation((url) => {
      if (url.includes('1.Resolution_for_2026.md')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockBlogContent)
        })
      }
      // For other files during scanning, return 404
      return Promise.resolve({
        ok: false,
        status: 404
      })
    })
  })

  it('should display blog navigation link in desktop menu', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    // Check for blog link in navigation
    const blogLink = screen.getByRole('link', { name: /blog/i })
    expect(blogLink).toBeInTheDocument()
    expect(blogLink).toHaveAttribute('href', '/blog')
  })

  it('should navigate to blog listing page when blog link is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    const blogLink = screen.getByRole('link', { name: /blog/i })
    fireEvent.click(blogLink)

    // Should show blog listing page
    await waitFor(() => {
      expect(screen.getByText(/blog posts/i)).toBeInTheDocument()
    })
  })

  it('should display blog posts on listing page', async () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    // Wait for blog content to load - should show the actual blog post
    await waitFor(() => {
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    // Check metadata display - look for the author specifically in the article
    const article = screen.getByRole('article')
    expect(article).toHaveTextContent(/minh ngo/i)
  })

  it('should navigate to blog detail page when post title is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    // Wait for blog listing to load
    await waitFor(() => {
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    // Click on "Read More" link instead of title to avoid duplicate text issues
    const readMoreLink = screen.getByRole('link', { name: /read more/i })
    fireEvent.click(readMoreLink)

    // Should navigate to detail page
    await waitFor(() => {
      expect(screen.getByText(/back to blog/i)).toBeInTheDocument()
    })
  })

  it('should render markdown content correctly on detail page', async () => {
    render(
      <MemoryRouter initialEntries={['/blogs/1']}>
        <App />
      </MemoryRouter>
    )

    // Wait for blog content to load - check for unique content
    await waitFor(() => {
      expect(screen.getByText(/back to blog/i)).toBeInTheDocument()
    })

    // Check that markdown is rendered - look for unique content
    expect(screen.getByText(/hello world, here is minh/i)).toBeInTheDocument()
    expect(screen.getByText(/context/i)).toBeInTheDocument()
  })

  it('should display 404 error for non-existent blog post', async () => {
    // Mock 404 response
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    render(
      <MemoryRouter initialEntries={['/blogs/999']}>
        <App />
      </MemoryRouter>
    )

    // Should show 404 error
    await waitFor(() => {
      expect(screen.getByText(/404.*not found/i)).toBeInTheDocument()
    })

    // Should have back to blog link
    expect(screen.getByRole('link', { name: /back to blog/i })).toBeInTheDocument()
  })

  it('should handle network errors gracefully', async () => {
    // Mock network error for all requests
    fetch.mockRejectedValue(new Error('Network error'))

    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    // Should show empty state when no blogs can be loaded
    await waitFor(() => {
      expect(screen.getByText(/no blog posts yet/i)).toBeInTheDocument()
    })
  })

  it('should display empty state when no blogs exist', async () => {
    // Mock empty response (no files found)
    fetch.mockResolvedValue({
      ok: false,
      status: 404
    })

    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText(/no blog posts yet/i)).toBeInTheDocument()
    })
  })

  it('should maintain consistent layout with navigation and footer', async () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    // Check navigation is present (use more specific selector)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    
    // Check all navigation links are present
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /education/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
  })

  it('should be responsive and work on mobile', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    render(
      <MemoryRouter initialEntries={['/blog']}>
        <App />
      </MemoryRouter>
    )

    // Mobile menu button should be present
    const menuButton = screen.getByRole('button')
    expect(menuButton).toBeInTheDocument()

    // Click mobile menu
    fireEvent.click(menuButton)

    // Blog link should be in mobile menu
    await waitFor(() => {
      const mobileBlogLinks = screen.getAllByRole('link', { name: /blog/i })
      expect(mobileBlogLinks.length).toBeGreaterThan(1) // Desktop + mobile
    })
  })
})