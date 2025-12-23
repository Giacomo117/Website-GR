import React from 'react';
import { Card } from './ui/card';
import { ExternalLink, Github, Plus, ChevronRight } from 'lucide-react';
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // Project context for AI chat
  const projectContexts = {
    'Civetta - Enterprise RAG Platform': `Civetta - Enterprise RAG Platform
Associated with E38

A distributed Retrieval-Augmented Generation (RAG) system serving as an intelligent virtual assistant for enterprise environments, built on scalable microservices architecture with multi-tenant support and no-code document management capabilities.

The system combines advanced document processing, vector search, and LLM orchestration to deliver domain-specific AI assistance across legal, business intelligence, and customer support sectors.

Core Architecture:
- Microservices Implementation: TypeScript-based orchestrator and frontend with Python-based RAG pipeline
- Multi-Modal Document Processing: Four specialized chunking pipelines (Mistral OCR for PDFs, Semantic chunking, Section-based analysis, LLaMA 3 70B Z-chunking)
- Advanced RAG Pipeline: Redis-based vector database with similarity search, image processing with vision models, contextual caption generation through o1-mini LLM refinement

Enterprise Features:
- Multi-tenant orchestration with client isolation and dynamic onboarding
- No-code frontend interface for autonomous document upload, API key management, and pipeline configuration
- Real-time streaming responses via Server-Sent Events
- Comprehensive observability and monitoring infrastructure
- Integration with MinIO object storage and Azure OpenAI for LLM inference

Technologies: Python, TypeScript, Angular, LangChain, Redis, MinIO, Azure OpenAI`,
    
    'AutoGuardian': `AutoGuardian - IoT Vehicle Safety Platform

A modular IoT platform for vehicle safety monitoring and neighbor-aware emergency alerting, featuring real-time telemetry processing, anomaly detection, and distributed alert dissemination.

The system connects Arduino/MCU devices via serial communication to a Django REST API backend, with MQTT-based alert broadcasting for low-latency emergency response coordination between nearby vehicles.

Key Features:
- Smart anomaly detection with false-positive suppression by comparing sensor readings across neighboring vehicles
- Geospatial neighbor discovery using distance calculations
- Web-based dashboard providing real-time vehicle monitoring, alert management, and system overview
- REST-first design with clean separation of concerns
- Comprehensive API endpoints for vehicles, alerts, and contact management

Technologies: Arduino, Django, MQTT, Mosquitto, Python, IoT
GitHub: github.com/Giacomo117/AutoGuardian`,
    
    'Drowsiness State Detector': `Drowsiness State Detector - Real-time Driver Monitoring System

A multi-model computer vision application for real-time driver drowsiness detection, composed of three standalone deep learning models working in parallel through multi-threaded processing.

Real-time performance achieved through concurrent model inference on webcam input, with OpenCV Haar cascades handling face detection and eye region extraction. A 10-second sliding buffer aggregates detection results for stable drowsiness assessment based on eye closure frequency, yawn rate, and head rotation metrics.

The Three Models:
1. Eye State Classification: MobileNetV2 classifier trained to distinguish between open/closed eyes on extracted eye regions
2. Yawn Detection: MobileNet trained for binary yawn classification from facial crops
3. Facial Keypoint Estimation: PyTorch ResNet50 predicting 68 facial landmarks for head pose analysis

Technologies: Python, OpenCV, PyTorch, TensorFlow, Deep Learning
GitHub: github.com/Giacomo117/Drowsiness-State-Detector`,
  };

  const handleProjectClick = (project) => {
    if (project.isMore) {
      onProjectClick({ message: 'What other projects has Giacomo worked on?', context: null });
    } else {
      const context = projectContexts[project.title] || null;
      onProjectClick({ 
        message: `What would you like to know about ${project.title}?`, 
        context: context 
      });
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

        {/* Desktop Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card 
                onClick={() => handleProjectClick(project)}
                className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 h-full cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.isMore && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plus className="text-white" size={64} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors font-['Space_Grotesk']">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

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

        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
              {projects.map((project) => (
                <Card 
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
                  style={{ width: '280px', flexShrink: 0 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {project.isMore && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Plus className="text-white" size={48} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors font-['Space_Grotesk']">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-3 text-sm line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                      >
                        <Github size={16} />
                        <span className="text-xs font-medium">View Code</span>
                      </a>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;