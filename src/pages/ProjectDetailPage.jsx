import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { findProjectById, ProjectError } from '../utils/projectUtils';
import ErrorBoundary from '../components/ErrorBoundary';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError('Project ID is required');
          return;
        }

        // Validate ID format
        if (typeof id !== 'string' || id.trim().length === 0) {
          setError('Invalid project ID format');
          return;
        }

        const projectData = await findProjectById(id);
        
        if (!projectData) {
          setError('Project not found');
          return;
        }

        setProject(projectData);
      } catch (err) {
        console.error('Error loading project:', err);
        
        let errorMessage = 'Failed to load project. Please try again later.';
        
        if (err instanceof ProjectError) {
          switch (err.code) {
            case 'NOT_FOUND':
              errorMessage = `Project with ID "${id}" was not found. It may have been moved or deleted.`;
              break;
            case 'ACCESS_DENIED':
              errorMessage = 'Access denied to this project. You may not have permission to view it.';
              break;
            case 'SERVER_ERROR':
              errorMessage = 'Server error occurred while loading the project. Please try again later.';
              break;
            case 'MALFORMED_FRONTMATTER':
              errorMessage = 'This project has formatting issues in its metadata. The content may still be readable.';
              break;
            case 'EMPTY_FILE':
              errorMessage = 'This project appears to be empty or corrupted.';
              break;
            case 'DIRECTORY_NOT_ACCESSIBLE':
              errorMessage = 'The projects directory is not accessible. Please check that project files exist.';
              break;
            default:
              errorMessage = err.message;
          }
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to fetch the project. Please check your internet connection and try again.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-900 text-white pt-20">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-900 text-white pt-20">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-4">Error Loading Project</h2>
              <p className="text-red-400 mb-6">{error}</p>
              <Link
                to="/about"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!project) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-900 text-white pt-20">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-slate-400 mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/about"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-white pt-20">
        <article className="max-w-4xl mx-auto px-4 py-16">
          {/* Back button */}
          <Link
            to="/about"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>

          {/* Project metadata */}
          <div className="mb-8 pb-8 border-b border-slate-700">
            <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-4">
              {project.contributors && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{project.contributors}</span>
                </div>
              )}
              
              {project.time && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time>{formatDate(project.time)}</time>
                </div>
              )}

              {project.readingTimeFormatted && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-base">{project.readingTimeFormatted}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Project content */}
          <div className="max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-8 first:mt-0 text-white border-b border-slate-700 pb-4 leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-10 text-blue-400 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl md:text-2xl font-bold mb-3 mt-8 text-cyan-400 leading-tight">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg md:text-xl font-bold mb-2 mt-6 text-white leading-tight">
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 className="text-base md:text-lg font-bold mb-2 mt-4 text-slate-200 leading-tight">
                    {children}
                  </h5>
                ),
                h6: ({ children }) => (
                  <h6 className="text-sm md:text-base font-bold mb-2 mt-4 text-slate-300 leading-tight">
                    {children}
                  </h6>
                ),
                p: ({ children }) => (
                  <p className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 underline-offset-2 transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="mb-6 space-y-2 text-slate-300 list-disc list-outside ml-6">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-6 space-y-2 text-slate-300 list-decimal list-outside ml-6">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-300 leading-relaxed pl-2">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-400 pl-6 pr-4 my-8 italic text-slate-300 bg-slate-800/50 py-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ inline, children }) => (
                  inline ? (
                    <code className="bg-slate-800 text-cyan-400 px-2 py-1 rounded text-sm font-mono border border-slate-700">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-slate-900 text-cyan-400 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-slate-700 leading-relaxed">
                      {children}
                    </code>
                  )
                ),
                pre: ({ children }) => (
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-6 border border-slate-700 shadow-lg">
                    {children}
                  </pre>
                ),
                img: ({ src, alt }) => (
                  <div className="my-8 text-center">
                    <img 
                      src={src} 
                      alt={alt} 
                      className="max-w-full h-auto rounded-lg shadow-xl border border-slate-700 mx-auto"
                      onError={(e) => {
                        console.warn(`Failed to load image: ${src}`);
                        e.target.style.display = 'none';
                        const altDiv = document.createElement('div');
                        altDiv.className = 'bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-400 italic';
                        altDiv.textContent = alt || 'Image failed to load';
                        e.target.parentNode.appendChild(altDiv);
                      }}
                    />
                    {alt && (
                      <p className="text-sm text-slate-400 mt-2 italic">{alt}</p>
                    )}
                  </div>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 rounded-lg border border-slate-700 shadow-lg">
                    <table className="min-w-full">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-800">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-slate-900/50">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="border-b border-slate-700 px-6 py-3 text-white font-semibold text-left text-sm uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-b border-slate-700 px-6 py-4 text-slate-300 text-sm">
                    {children}
                  </td>
                ),
                hr: () => (
                  <hr className="border-slate-700 my-12 border-t-2" />
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-white">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-200">
                    {children}
                  </em>
                )
              }}
            >
              {project.content}
            </ReactMarkdown>
          </div>

          {/* Back to projects button */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <Link
              to="/about"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Projects
            </Link>
          </div>
        </article>
      </div>
    </ErrorBoundary>
  );
}
