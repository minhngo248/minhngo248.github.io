import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function ProjectCard({ project, showLink = true }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
      <h4 className="text-xl font-bold mb-2">{project.name}</h4>
      <p className="text-slate-400 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags && project.tags.map(tag => (
          <span key={tag} className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      {showLink && (
        <Link 
          to={`/projects/${project.id}`} 
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          View Project <ExternalLink size={16} />
        </Link>
      )}
    </div>
  );
}
