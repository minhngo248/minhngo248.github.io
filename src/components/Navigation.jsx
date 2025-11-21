import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-400">Minh Ngo</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          <Link to="/" className="text-slate-300 hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/about" className="text-slate-300 hover:text-blue-400 transition">
            About
          </Link>
          <Link to="/education" className="text-slate-300 hover:text-blue-400 transition">
            Education
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
}
