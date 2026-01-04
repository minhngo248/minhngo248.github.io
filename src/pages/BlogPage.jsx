import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  loadAllBlogs, 
  BlogError, 
  sortBlogsByDate, 
  filterBlogsBySearch, 
  filterBlogsByTags, 
  getAllTagsFromBlogs 
} from '../utils/blogUtils';
import ErrorBoundary from '../components/ErrorBoundary';

export default function BlogPage() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        const blogPosts = await loadAllBlogs();
        
        // Sort by newest first by default
        const sortedBlogs = sortBlogsByDate(blogPosts, 'newest');
        
        setAllBlogs(sortedBlogs);
        setFilteredBlogs(sortedBlogs);
        setAvailableTags(getAllTagsFromBlogs(sortedBlogs));
      } catch (err) {
        console.error('Error loading blogs:', err);
        
        let errorMessage = 'Failed to load blog posts. Please try again later.';
        
        if (err instanceof BlogError) {
          switch (err.code) {
            case 'DIRECTORY_NOT_ACCESSIBLE':
              errorMessage = 'The blog directory is not accessible. Please check that blog files exist in the /public/blogs directory.';
              break;
            case 'DIRECTORY_ERROR':
              errorMessage = 'There was an issue accessing the blog directory. The directory may not exist or may be empty.';
              break;
            case 'LOAD_ALL_ERROR':
              errorMessage = 'Multiple errors occurred while loading blog posts. Some files may be corrupted or have invalid formatting.';
              break;
            default:
              errorMessage = err.message;
          }
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to fetch blog files. Please check your internet connection and try again.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  // Apply filters whenever search, tags, or sort order changes
  useEffect(() => {
    let filtered = [...allBlogs];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filterBlogsBySearch(filtered, searchQuery);
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filterBlogsByTags(filtered, selectedTags);
    }
    
    // Apply sorting
    filtered = sortBlogsByDate(filtered, sortOrder);
    
    setFilteredBlogs(filtered);
  }, [allBlogs, searchQuery, selectedTags, sortOrder]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortOrder('newest');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      // Handle the format "2026-01-03 13:13:42 +0100"
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-6"></div>
          <p className="text-slate-700 dark:text-slate-300 text-lg">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-xl p-8 mb-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-3">Error Loading Blogs</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <ErrorBoundary 
      title="Blog Loading Error"
      message="There was an error loading the blog listing. Please try refreshing the page."
      showBackToBlogs={false}
    >
      <section className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Blog Posts
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Thoughts, experiences, and insights from my journey in software development.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search by title or description
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 pl-10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort Order */}
          <div className="lg:w-48">
            <label htmlFor="sort" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sort by date
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Earliest</option>
            </select>
          </div>
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Filter by tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters & Clear */}
        {(searchQuery || selectedTags.length > 0 || sortOrder !== 'newest') && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-sm">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-sm">
                Tag: {tag}
              </span>
            ))}
            {sortOrder !== 'newest' && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-sm">
                Sort: {sortOrder === 'oldest' ? 'Earliest' : 'Most Recent'}
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredBlogs.length} of {allBlogs.length} blog posts
        </div>
      </div>

      {filteredBlogs.length === 0 && allBlogs.length > 0 ? (
        <div className="text-center py-16">
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-300 mb-4">No Posts Found</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              No blog posts match your current filters. Try adjusting your search or clearing some filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-300 mb-4">No Blog Posts Yet</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Check back soon for new content! I'm working on some exciting posts to share.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredBlogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 hover:border-blue-500 dark:hover:border-blue-400/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex-1">
                  <Link 
                    to={`/blogs/${blog.id}`}
                    className="block group"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                      {blog.title || `Blog Post ${blog.id}`}
                    </h2>
                  </Link>
                  
                  <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {blog.author && (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{blog.author}</span>
                      </span>
                    )}
                    
                    {blog.time && (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDate(blog.time)}</span>
                      </span>
                    )}

                    {blog.readingTimeFormatted && (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 6.253v1.227a.75.75 0 01-.427.68l-1.18.59a1.5 1.5 0 00-.26 2.409l.024.033a1.5 1.5 0 001.238.399l.93-.066a.75.75 0 01.81.81l-.066.93a1.5 1.5 0 00.399 1.238l.033.024a1.5 1.5 0 002.409-.26l.59-1.18A.75.75 0 0116.747 12H18a.75.75 0 01.75.75 1.5 1.5 0 01-1.5 1.5h-1.253a.75.75 0 01-.68-.427l-.59-1.18a1.5 1.5 0 00-2.409-.26l-.033.024a1.5 1.5 0 00-.399 1.238l.066.93a.75.75 0 01-.81.81l-.93-.066a1.5 1.5 0 00-1.238.399l-.024.033a1.5 1.5 0 00.26 2.409l1.18.59a.75.75 0 01.427.68V18a.75.75 0 01-.75.75 1.5 1.5 0 01-1.5-1.5v-1.253a.75.75 0 01.427-.68l1.18-.59a1.5 1.5 0 00.26-2.409l-.024-.033a1.5 1.5 0 00-1.238-.399l-.93.066a.75.75 0 01-.81-.81l.066-.93a1.5 1.5 0 00-.399-1.238l-.033-.024a1.5 1.5 0 00-2.409.26l-.59 1.18A.75.75 0 016.253 12H6a.75.75 0 01-.75-.75 1.5 1.5 0 011.5-1.5h1.253a.75.75 0 01.68.427l.59 1.18a1.5 1.5 0 002.409.26l.033-.024a1.5 1.5 0 00.399-1.238l-.066-.93a.75.75 0 01.81-.81l.93.066a1.5 1.5 0 001.238-.399l.024-.033a1.5 1.5 0 00-.26-2.409l-1.18-.59A.75.75 0 0112 6.253z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{blog.readingTimeFormatted}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {blog.description && (
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-base md:text-lg">
                  {blog.description}
                </p>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <Link 
                to={`/blogs/${blog.id}`}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold transition-colors group"
              >
                Read More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
    </ErrorBoundary>
  );
}