import React from 'react';
import { Card } from './ui/card';
import { ExternalLink, Github, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Projects = ({ onProjectClick }) => {
  const projects = [
    {
      id: 1,
      title: 'Civetta - Enterprise RAG Platform',
      description: 'A distributed Retrieval-Augmented Generation (RAG) system serving as an intelligent virtual assistant for enterprise environments, built on scalable microservices architecture with multi-tenant support and no-code document management capabilities.',
      technologies: ['Python', 'LangChain', 'Microservices', 'RAG', 'Enterprise AI'],
      gradient: 'from-cyan-500 to-blue-600',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'AutoGuardian',
      description: 'A modular IoT platform for vehicle safety monitoring and neighbor-aware emergency alerting, featuring real-time telemetry processing, anomaly detection, and distributed alert dissemination.',
      technologies: ['Arduino', 'Django', 'MQTT', 'IoT', 'Real-time Processing'],
      gradient: 'from-purple-500 to-pink-600',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
      github: 'https://github.com/Giacomo117/AutoGuardian',
    },
    {
      id: 3,
      title: 'Drowsiness State Detector',
      description: 'A multi-model computer vision application for real-time driver drowsiness detection, composed of three standalone deep learning models working in parallel through multi-threaded processing.',
      technologies: ['Python', 'OpenCV', 'PyTorch', 'Computer Vision', 'Deep Learning'],
      gradient: 'from-orange-500 to-red-600',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
      github: 'https://github.com/Giacomo117/Drowsiness-State-Detector',
    },
    {
      id: 4,
      title: 'And Many More!',
      description: 'Explore my other projects including mobile applications, web services, and research work in AI and distributed systems. Always working on something new and exciting!',
      technologies: ['Innovation', 'Creativity', 'Problem Solving'],
      gradient: 'from-green-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&auto=format&fit=crop',
      isMore: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const handleProjectClick = (project) => {
    if (project.isMore) {
      onProjectClick('What other projects has Giacomo worked on?');
    } else {
      onProjectClick(`What would you like to know about ${project.title}?`);
    }
  };

  return (
    <section id="projects" className="py-24 px-6 lg:px-8 bg-black relative z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk'] text-white">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Innovative solutions leveraging AI, IoT, and enterprise architectures
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card 
                onClick={() => handleProjectClick(project)}
                className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 h-full cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {project.isMore && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plus className="text-white" size={64} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors font-['Space_Grotesk']">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Github size={20} />
                        <span className="text-sm font-medium">View Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;