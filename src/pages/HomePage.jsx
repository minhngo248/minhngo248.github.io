import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
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
            <Link 
              to="/about" 
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold transition"
            >
              Learn More
            </Link>
            <a 
              href="/cv.pdf" 
              className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
            >
              Download CV
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-8 rounded-lg border border-blue-400/30">
            <div className="space-y-4 font-mono text-sm">
              <div><span className="text-purple-400">public class</span> <span className="text-blue-300">BackendDeveloper</span> {'{'}
                <div className="ml-4 space-y-2">
                  <div><span className="text-purple-400">public static void</span> <span className="text-yellow-300">main</span>(String[] args) {'{'}</div>
                  <div className="ml-8 space-y-2">
                    <div>String[] skills = {'{'}</div>
                    <div className="ml-4 space-y-1">
                      <div><span className="text-green-400">"Java"</span>,</div>
                      <div><span className="text-green-400">"Spring"</span>,</div>
                      <div><span className="text-green-400">"Microservice"</span>,</div>
                      <div><span className="text-green-400">"AWS"</span>,</div>
                      <div><span className="text-green-400">"DevOps"</span></div>
                    </div>
                    <div>{'};'}</div>
                  </div>
                  <div className="ml-4">{'}'}</div>
                </div>
              {'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
