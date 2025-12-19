import React from 'react';
import { Card } from './ui/card';
import { GraduationCap, Award, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Formation = () => {
  const education = [
    {
      id: 1,
      type: 'Master Degree',
      title: 'Artificial Intelligence Engineering',
      institution: 'Università di Modena e Reggio Emilia',
      location: 'Modena, Italy',
      period: 'Sep 2023 - Oct 2025',
      grade: '110L',
      thesis: 'Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration',
      icon: GraduationCap,
      color: 'cyan',
    },
    {
      id: 2,
      type: 'Bachelor Degree',
      title: 'Computer Engineering',
      institution: 'Università di Modena e Reggio Emilia',
      location: 'Modena, Italy',
      period: 'Sep 2020 - Oct 2023',
      grade: '107/110',
      thesis: 'Design and development of an augmented reality application for face filtering on Unity',
      icon: GraduationCap,
      color: 'blue',
    },
    {
      id: 3,
      type: 'Erasmus+',
      title: 'Computer Engineering',
      institution: 'Exeter University',
      location: 'Exeter, United Kingdom',
      period: 'Jan 2023 - Jun 2023',
      description: 'International exchange program focusing on advanced computer science topics',
      icon: Award,
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
    <section id="formation" className="py-24 px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk'] text-white">
            Education & <span className="text-cyan-400">Formation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Academic background and international experiences
          </p>
        </motion.div>

        {/* Desktop Stacked */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="hidden lg:block space-y-6 mb-16"
        >
          {education.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden group">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`text-${item.color}-400`} size={32} />
                    </div>

                    <div className="flex-grow">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full mb-2">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk'] group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-lg text-gray-300 mb-3">
                        {item.institution}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{item.period}</span>
                        </div>
                        {item.grade && (
                          <div className="flex items-center gap-1">
                            <Award size={16} />
                            <span>Final Grade: {item.grade}</span>
                          </div>
                        )}
                      </div>

                      {item.thesis && (
                        <p className="text-gray-400 italic">
                          <strong className="text-gray-300">Thesis:</strong> {item.thesis}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-gray-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile Horizontal Scroll with Arrow */}
        <div className="lg:hidden relative mb-16">
          <div className="overflow-x-auto pb-4 px-6 -mx-6">
            <div className="flex gap-4 pl-6" style={{ width: 'max-content' }}>
            {education.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id}
                  className="bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300"
                  style={{ width: '280px', flexShrink: 0 }}
                >
                  <div className="p-4">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center mb-3`}>
                      <Icon className={`text-${item.color}-400`} size={24} />
                    </div>

                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full mb-2">
                        {item.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 font-['Space_Grotesk']">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-300 font-medium mb-3">
                      {item.institution}
                    </p>
                    
                    <div className="space-y-1 mb-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{item.period}</span>
                      </div>
                      {item.grade && (
                        <div className="flex items-center gap-1">
                          <Award size={14} />
                          <span>Grade: {item.grade}</span>
                        </div>
                      )}
                    </div>

                    {item.thesis && (
                      <p className="text-gray-400 text-xs italic line-clamp-3">
                        <strong className="text-gray-300">Thesis:</strong> {item.thesis}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-gray-400 text-xs line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-3xl font-bold mb-8 font-['Space_Grotesk'] text-white">
            Technical <span className="text-cyan-400">Skills</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'C'].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs bg-zinc-800 text-gray-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">AI & ML</h4>
              <div className="flex flex-wrap gap-2">
                {['PyTorch', 'LangChain', 'OpenCV', 'Deep Learning', 'RAG Systems'].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs bg-zinc-800 text-gray-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Frameworks</h4>
              <div className="flex flex-wrap gap-2">
                {['Django', 'Angular', 'React', 'FastAPI', 'Unity'].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs bg-zinc-800 text-gray-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Tools & Tech</h4>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Git', 'Azure', 'MQTT', 'PostgreSQL', 'Neo4j'].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs bg-zinc-800 text-gray-300 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Formation;