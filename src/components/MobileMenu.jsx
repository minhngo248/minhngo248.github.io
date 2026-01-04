import { Link } from 'react-router-dom';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-slate-800 border-t border-slate-700">
      <div className="flex flex-col gap-4 p-4">
        <Link 
          to="/" 
          onClick={onClose}
          className="text-left text-slate-300 hover:text-blue-400"
        >
          Home
        </Link>
        <Link 
          to="/about" 
          onClick={onClose}
          className="text-left text-slate-300 hover:text-blue-400"
        >
          About
        </Link>
        <Link 
          to="/education" 
          onClick={onClose}
          className="text-left text-slate-300 hover:text-blue-400"
        >
          Education
        </Link>
        <Link 
          to="/blog" 
          onClick={onClose}
          className="text-left text-slate-300 hover:text-blue-400"
        >
          Blog
        </Link>
      </div>
    </div>
  );
}
