import { education, courses } from '../data/education';
import { certifications } from '../data/certifications';

export default function EducationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* Education Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Education
        </h2>
        <div className="space-y-6">
          {[...education].reverse().map(edu => (
            <div key={edu.id} className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-300 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{edu.degree}</h3>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-2">{edu.institution}</p>
              <p className="text-slate-600 dark:text-slate-400 mb-3">{edu.year}</p>
              <p className="text-slate-700 dark:text-slate-300">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Certifications
        </h2>
        <div className="space-y-6">
          {[...certifications].reverse().map(cert => (
            <div key={cert.id} className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-300 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{cert.name}</h3>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-2">{cert.issuer}</p>
              <p className="text-slate-600 dark:text-slate-400 mb-3">{cert.date}</p>
              <p className="text-slate-700 dark:text-slate-300 mb-4">{cert.description}</p>
              {cert.badgeUrl && (
                <a
                  href={cert.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  View Badge
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Online Courses Section */}
      <section>
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Online Courses
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...courses].reverse().map(course => (
            <div key={course.id} className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{course.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
