import { useState, useEffect } from 'react';
import { skills } from '../data/skills';
import { loadAllProjects, ProjectError, sortProjectsByDate } from '../utils/projectUtils';
import ProjectCard from '../components/ProjectCard';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AboutPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const projectPosts = await loadAllProjects();
        
        // Sort by newest first by default
        const sortedProjects = sortProjectsByDate(projectPosts, 'newest');
        
        setProjects(sortedProjects);
      } catch (err) {
        console.error('Error loading projects:', err);
        
        let errorMessage = 'Failed to load projects. Please try again later.';
        
        if (err instanceof ProjectError) {
          switch (err.code) {
            case 'DIRECTORY_NOT_ACCESSIBLE':
              errorMessage = 'The projects directory is not accessible. Please check that project files exist in the /public/projects directory.';
              break;
            case 'DIRECTORY_ERROR':
              errorMessage = 'There was an issue accessing the projects directory. The directory may not exist or may be empty.';
              break;
            case 'LOAD_ALL_ERROR':
              errorMessage = 'Multiple errors occurred while loading projects. Some files may be corrupted or have invalid formatting.';
              break;
            default:
              errorMessage = err.message;
          }
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to fetch project files. Please check your internet connection and try again.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Biography Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="text-slate-300 text-lg space-y-4 text-justify">
            <p>
              I'm Minh Ngo, a backend developer with a passion for Cloud native technologies, 
              DevOps practices, and building scalable applications that solve real-world problems.
            </p>
            <p>
              My expertise lies in designing and implementing robust backend systems using modern 
              technologies and best practices. I specialize in microservices architecture, 
              containerization, and cloud infrastructure, with a focus on creating solutions 
              that are both performant and maintainable.
            </p>
            <p>
              I believe in continuous learning and staying current with industry trends. 
              Whether it's optimizing database queries, implementing CI/CD pipelines, or 
              architecting distributed systems, I'm driven by the challenge of building 
              scalable applications that can grow with business needs.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-6">Technical Skills</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <span 
                key={skill.name} 
                className="bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-lg font-semibold"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Recent Projects Section */}
        <section>
          <h3 className="text-3xl font-bold mb-6">Recent Projects</h3>
          
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No projects available yet.</p>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} showLink={true} />
              ))}
            </div>
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
}
