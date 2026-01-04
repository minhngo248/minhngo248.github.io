import { skills } from '../data/skills';
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

export default function AboutPage() {
  return (
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} showLink={true} />
          ))}
        </div>
      </section>
    </div>
  );
}
