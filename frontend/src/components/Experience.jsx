import React from 'react';
import { Card } from './ui/card';
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      role: 'AI Software Engineer',
      company: 'E38',
      location: 'Remote',
      period: 'Feb 2025 - Present',
      type: 'Full-time',
      description: 'Developing cutting-edge AI solutions and intelligent systems for enterprise clients.',
      technologies: ['Python', 'AI/ML', 'LangChain', 'Microservices'],
      color: 'cyan',
    },
    {
      id: 2,
      role: 'Freelance Software Developer',
      company: 'Self-employed',
      location: 'Remote',
      period: 'Oct 2024 - Feb 2025',
      type: 'Freelance',
      description: 'Specialized in backend development and LLM-based RAG systems. Built distributed AI solutions for various clients.',
      technologies: ['Backend', 'LLM', 'RAG Systems', 'Python', 'Django'],
      color: 'blue',
    },
    {
      id: 3,
      role: 'Scout Leader',
      company: 'AGESCI Modena 9',
      location: 'Modena, Italy',
      period: '2020 - Present',
      type: 'Volunteer',
      description: 'Leading and mentoring young scouts, organizing educational activities and outdoor adventures.',
      technologies: ['Leadership', 'Education', 'Team Management'],
      color: 'green',
    },
    {
      id: 4,
      role: 'Private Tutor',
      company: 'Self-employed',
      location: 'Modena, Italy',
      period: '2020 - Present',
      type: 'Part-time',
      description: 'Teaching mathematics, physics, English, and computer science to high school and university students.',
      technologies: ['Mathematics', 'Physics', 'Programming', 'English'],
      color: 'purple',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="experience" className="py-24 px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk'] text-white">
            Work <span className="text-cyan-400">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Professional journey and roles that shaped my expertise
          </p>
        </motion.div>

        {/* Desktop Stacked */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="hidden lg:block space-y-6"
        >
          {experiences.map((exp) => (
            <motion.div key={exp.id} variants={itemVariants}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-${exp.color}-500/10 border border-${exp.color}-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Briefcase className={`text-${exp.color}-400`} size={32} />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1 font-['Space_Grotesk'] group-hover:text-cyan-400 transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-lg text-gray-300 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                        {exp.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs bg-zinc-800 text-gray-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden relative">
          <div className="overflow-x-auto pb-4 px-6 -mx-6">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {experiences.map((exp) => (
              <Card 
                key={exp.id}
                className="bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300"
                style={{ width: '280px', flexShrink: 0 }}
              >
                <div className="p-4">
                  <div className={`w-12 h-12 rounded-xl bg-${exp.color}-500/10 border border-${exp.color}-500/30 flex items-center justify-center mb-3`}>
                    <Briefcase className={`text-${exp.color}-400`} size={24} />
                  </div>

                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full mb-2">
                      {exp.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 font-['Space_Grotesk']">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-gray-300 font-medium mb-3">
                    {exp.company}
                  </p>
                  
                  <div className="space-y-1 mb-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-zinc-800 text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;