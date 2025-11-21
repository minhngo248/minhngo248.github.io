import { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navigate = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">Backend Dev</div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <button onClick={() => navigate('home')} className={`transition ${currentPage === 'home' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}>Home</button>
            <button onClick={() => navigate('about')} className={`transition ${currentPage === 'about' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}>About</button>
            <button onClick={() => navigate('education')} className={`transition ${currentPage === 'education' ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'}`}>Education</button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="flex flex-col gap-4 p-4">
              <button onClick={() => navigate('home')} className="text-left text-slate-300 hover:text-blue-400">Home</button>
              <button onClick={() => navigate('about')} className="text-left text-slate-300 hover:text-blue-400">About</button>
              <button onClick={() => navigate('education')} className="text-left text-slate-300 hover:text-blue-400">Education</button>
            </div>
          </div>
        )}
      </nav>

      {/* Home Page */}
      {currentPage === 'home' && (
        <section className="max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Backend Developer
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Building scalable APIs and robust backend systems. Passionate about clean code, system design, and solving complex problems.
              </p>
              <div className="flex gap-4">
                <button onClick={() => navigate('about')} className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold transition">
                  Learn More
                </button>
                <button className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 px-8 py-3 rounded-lg font-semibold transition">
                  Download CV
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-8 rounded-lg border border-blue-400/30">
                <div className="space-y-4 font-mono text-sm">
                  <div><span className="text-green-400">const</span> <span className="text-blue-300">developer</span> = {'{'}
                    <div className="ml-4 space-y-2">
                      <div><span className="text-slate-400">name:</span> <span className="text-yellow-400">"Your Name"</span>,</div>
                      <div><span className="text-slate-400">role:</span> <span className="text-yellow-400">"Backend Engineer"</span>,</div>
                      <div><span className="text-slate-400">skills:</span> [<span className="text-yellow-400">"Node.js", "Python", "PostgreSQL"</span>]</div>
                    </div>
                  {'}'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Page */}
      {currentPage === 'about' && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold mb-12">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-slate-300 text-lg mb-6">
                I'm a backend developer with a passion for building scalable, maintainable systems. I specialize in designing APIs, optimizing databases, and implementing best practices in software architecture.
              </p>
              <p className="text-slate-300 text-lg mb-6">
                With experience in cloud infrastructure and microservices, I focus on creating solutions that are both performant and easy to maintain.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Redis', 'REST APIs', 'GraphQL', 'Git', 'Linux', 'System Design'].map(skill => (
                  <div key={skill} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">Recent Projects</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'E-commerce API', desc: 'RESTful API with Node.js and PostgreSQL', tech: ['Node.js', 'Express', 'PostgreSQL'] },
              { title: 'Real-time Chat Server', desc: 'WebSocket-based messaging system', tech: ['Python', 'Redis', 'Websockets'] },
              { title: 'Microservices Platform', desc: 'Distributed system with Docker', tech: ['Docker', 'Kubernetes', 'Node.js'] },
              { title: 'Data Pipeline', desc: 'ETL pipeline for analytics', tech: ['Python', 'Apache Airflow', 'PostgreSQL'] },
            ].map((project, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
                <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                <p className="text-slate-400 mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map(t => <span key={t} className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded">{t}</span>)}
                </div>
                <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  View Project <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Page */}
      {currentPage === 'education' && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold mb-12">Education & Certifications</h2>
          
          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">Bachelor of Science in Computer Science</h3>
              <p className="text-blue-400 font-semibold mb-2">University Name • 2020</p>
              <p className="text-slate-300">Relevant coursework: Data Structures, Algorithms, Database Systems, Operating Systems, Software Engineering</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">AWS Certified Solutions Architect</h3>
              <p className="text-blue-400 font-semibold mb-2">Amazon Web Services • 2023</p>
              <p className="text-slate-300">Professional-level certification in cloud architecture and AWS services</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">Kubernetes Administrator</h3>
              <p className="text-blue-400 font-semibold mb-2">The Linux Foundation • 2023</p>
              <p className="text-slate-300">Certified in container orchestration and Kubernetes administration</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-12 mb-6">Online Courses & Learning</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {['System Design Masterclass', 'Advanced Python Programming', 'Database Optimization', 'Microservices Architecture', 'Cloud Security', 'DevOps Engineering'].map(course => (
              <div key={course} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                {course}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-20 py-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center flex-col md:flex-row gap-6">
            <p className="text-slate-400">© 2024 Backend Developer. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition"><Github size={24} /></a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition"><Linkedin size={24} /></a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition"><Mail size={24} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
