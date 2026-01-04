import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 mt-20 py-8 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center flex-col md:flex-row gap-6">
          <p className="text-slate-600 dark:text-slate-400">© 2025 Minh Ngo. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://github.com/minhngo248" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/minh-nn/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Linkedin size={24} />
            </a>
            <a href="mailto:ngocminhk62@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
