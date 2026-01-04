import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { findBlogById, BlogError } from '../utils/blogUtils';
import ErrorBoundary from '../components/ErrorBoundary';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('Blog ID is required');
          return;
        }

        // Validate ID format
        if (typeof id !== 'string' || id.trim().length === 0) {
          setError('Invalid blog ID format');
          return;
        }

        const blogPost = await findBlogById(id);
        
        if (!blogPost) {
          setError('Blog post not found');
          return;
        }

        setBlog(blogPost);
      } catch (err) {
        console.error('Error loading blog:', err);
        
        let errorMessage = 'Failed to load blog post. Please try again later.';
        
        if (err instanceof BlogError) {
          switch (err.code) {
            case 'NOT_FOUND':
              errorMessage = `Blog post with ID "${id}" was not found. It may have been moved or deleted.`;
              break;
            case 'ACCESS_DENIED':
              errorMessage = 'Access denied to this blog post. You may not have permission to view it.';
              break;
            case 'SERVER_ERROR':
              errorMessage = 'Server error occurred while loading the blog post. Please try again later.';
              break;
            case 'MALFORMED_FRONTMATTER':
              errorMessage = 'This blog post has formatting issues in its metadata. The content may still be readable.';
              break;
            case 'EMPTY_FILE':
              errorMessage = 'This blog post appears to be empty or corrupted.';
              break;
            case 'DIRECTORY_NOT_ACCESSIBLE':
              errorMessage = 'The blog directory is not accessible. Please check that blog files exist.';
              break;
            default:
              errorMessage = err.message;
          }
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to fetch the blog post. Please check your internet connection and try again.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
          <p className="text-slate-300 text-lg">Loading blog post...</p>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 mb-8 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-4">404 - Blog Post Not Found</h1>
            <p className="text-slate-300 mb-8 leading-relaxed">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-20">
      {/* Back to blog link */}
      <div className="mb-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Blog metadata */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          {blog.title || `Blog Post ${blog.id}`}
        </h1>
        
        <div className="flex flex-wrap gap-4 md:gap-6 text-slate-600 dark:text-slate-400 mb-4">
          {blog.author && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-base">{blog.author}</span>
            </div>
          )}
          
          {blog.time && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-base">{formatDate(blog.time)}</span>
            </div>
          )}

          {blog.readingTimeFormatted && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 6.253v1.227a.75.75 0 01-.427.68l-1.18.59a1.5 1.5 0 00-.26 2.409l.024.033a1.5 1.5 0 001.238.399l.93-.066a.75.75 0 01.81.81l-.066.93a1.5 1.5 0 00.399 1.238l.033.024a1.5 1.5 0 002.409-.26l.59-1.18A.75.75 0 0116.747 12H18a.75.75 0 01.75.75 1.5 1.5 0 01-1.5 1.5h-1.253a.75.75 0 01-.68-.427l-.59-1.18a1.5 1.5 0 00-2.409-.26l-.033.024a1.5 1.5 0 00-.399 1.238l.066.93a.75.75 0 01-.81.81l-.93-.066a1.5 1.5 0 00-1.238.399l-.024.033a1.5 1.5 0 00.26 2.409l1.18.59a.75.75 0 01.427.68V18a.75.75 0 01-.75.75 1.5 1.5 0 01-1.5-1.5v-1.253a.75.75 0 01.427-.68l1.18-.59a1.5 1.5 0 00.26-2.409l-.024-.033a1.5 1.5 0 00-1.238-.399l-.93.066a.75.75 0 01-.81-.81l.066-.93a1.5 1.5 0 00-.399-1.238l-.033-.024a1.5 1.5 0 00-2.409.26l-.59 1.18A.75.75 0 016.253 12H6a.75.75 0 01-.75-.75 1.5 1.5 0 011.5-1.5h1.253a.75.75 0 01.68.427l.59 1.18a1.5 1.5 0 002.409.26l.033-.024a1.5 1.5 0 00.399-1.238l-.066-.93a.75.75 0 01.81-.81l.93.066a1.5 1.5 0 001.238-.399l.024-.033a1.5 1.5 0 00-.26-2.409l-1.18-.59A.75.75 0 0112 6.253z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-base">{blog.readingTimeFormatted}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-300 dark:border-slate-700">
            {blog.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {!blog.tags || blog.tags.length === 0 ? (
          <div className="border-b border-slate-300 dark:border-slate-700 pb-6"></div>
        ) : null}
      </header>

      {/* Blog content */}
      <ErrorBoundary 
        title="Markdown Rendering Error"
        message="There was an error rendering this blog post's content. The markdown may contain invalid formatting."
      >
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              // Enhanced styling for markdown elements with better typography and spacing
              h1: ({ children }) => (
                <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-8 first:mt-0 text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-4 leading-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-10 text-blue-600 dark:text-blue-400 leading-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl md:text-2xl font-bold mb-3 mt-8 text-cyan-600 dark:text-cyan-400 leading-tight">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg md:text-xl font-bold mb-2 mt-6 text-slate-900 dark:text-white leading-tight">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base md:text-lg font-bold mb-2 mt-4 text-slate-800 dark:text-slate-200 leading-tight">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm md:text-base font-bold mb-2 mt-4 text-slate-700 dark:text-slate-300 leading-tight">
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg text-justify">
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline decoration-blue-500/50 dark:decoration-blue-400/50 hover:decoration-blue-400 dark:hover:decoration-blue-300 underline-offset-2 transition-colors font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="mb-6 space-y-2 text-slate-700 dark:text-slate-300 list-disc list-outside ml-6">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-6 space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-outside ml-6">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-700 dark:text-slate-300 leading-relaxed pl-2">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 pr-4 my-8 italic text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 py-4 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) => (
                inline ? (
                  <code className="bg-slate-200 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 px-2 py-1 rounded text-sm font-mono border border-slate-300 dark:border-slate-700">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-slate-100 dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-slate-300 dark:border-slate-700 leading-relaxed">
                    {children}
                  </code>
                )
              ),
              pre: ({ children }) => (
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto mb-6 border border-slate-300 dark:border-slate-700 shadow-lg">
                  {children}
                </pre>
              ),
              img: ({ src, alt }) => (
                <div className="my-8 text-center">
                  <img 
                    src={src} 
                    alt={alt} 
                    className="max-w-full h-auto rounded-lg shadow-xl border border-slate-300 dark:border-slate-700 mx-auto"
                    onError={(e) => {
                      console.warn(`Failed to load image: ${src}`);
                      e.target.style.display = 'none';
                      // Show alt text if image fails to load
                      const altDiv = document.createElement('div');
                      altDiv.className = 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-slate-600 dark:text-slate-400 italic';
                      altDiv.textContent = alt || 'Image failed to load';
                      e.target.parentNode.appendChild(altDiv);
                    }}
                  />
                  {alt && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">{alt}</p>
                  )}
                </div>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-lg">
                  <table className="min-w-full">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-100 dark:bg-slate-800">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="bg-white dark:bg-slate-900/50">
                  {children}
                </tbody>
              ),
              th: ({ children }) => (
                <th className="border-b border-slate-300 dark:border-slate-700 px-6 py-3 text-slate-900 dark:text-white font-semibold text-left text-sm uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-b border-slate-300 dark:border-slate-700 px-6 py-4 text-slate-700 dark:text-slate-300 text-sm">
                  {children}
                </td>
              ),
              hr: () => (
                <hr className="border-slate-300 dark:border-slate-700 my-12 border-t-2" />
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-slate-900 dark:text-white">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-slate-700 dark:text-slate-200">
                  {children}
                </em>
              )
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </ErrorBoundary>

      {/* Navigation footer */}
      <footer className="mt-12 pt-8 border-t border-slate-300 dark:border-slate-700">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Posts
        </Link>
      </footer>
    </article>
  );
}