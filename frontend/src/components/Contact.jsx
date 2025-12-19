import React from 'react';
import { Card } from './ui/card';
import { Mail, Linkedin, Github, MapPin, Instagram, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = ({ onChatOpen }) => {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'reggianini.giacomo01@gmail.com',
      href: 'mailto:reggianini.giacomo01@gmail.com',
      color: 'cyan',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@giacomoreggia_',
      href: 'https://instagram.com/giacomoreggia_',
      color: 'pink',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Modena, Italy',
      color: 'purple',
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/giacomo-reggianini-0667bb300/',
      color: 'blue',
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/Giacomo117',
      color: 'gray',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://instagram.com/giacomoreggia_',
      color: 'pink',
    },
  ];

  return (
    <section id="contact" className="py-24 px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk'] text-white">
            Get In <span className="text-cyan-400">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Let's discuss how we can work together on innovative AI solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-8 h-full">
              <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-white">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center`}>
                        <Icon className={`text-${item.color}-400`} size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-cyan-400 transition-colors font-medium break-all text-sm md:text-base"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white font-medium break-all text-sm md:text-base">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-zinc-800">
                <h4 className="text-lg font-semibold mb-4 text-white">Connect with me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-lg bg-zinc-800 hover:bg-cyan-500/10 border border-zinc-700 hover:border-cyan-500/50 flex items-center justify-center transition-all duration-300 group"
                        aria-label={social.label}
                      >
                        <Icon className="text-gray-400 group-hover:text-cyan-400 transition-colors" size={24} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30 p-8 h-full flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4 font-['Space_Grotesk'] text-white">
                Let's Build Something Amazing
              </h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                I'm currently available for freelance work and open to discussing new opportunities in AI engineering, distributed systems, and enterprise solutions.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:reggianini.giacomo01@gmail.com"
                  className="inline-block w-full px-8 py-4 bg-cyan-500 text-black text-center font-semibold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95"
                >
                  Send me an Email
                </a>
                <a
                  href="https://www.linkedin.com/in/giacomo-reggianini-0667bb300/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full px-8 py-4 bg-zinc-800 text-white text-center font-semibold rounded-full hover:bg-zinc-700 transition-all border border-zinc-700 hover:border-cyan-500/50"
                >
                  Connect on LinkedIn
                </a>
                {/* Chat Button - Hidden on Mobile */}
                <button
                  onClick={onChatOpen}
                  className="hidden md:inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center font-semibold rounded-full hover:from-cyan-400 hover:to-blue-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30"
                >
                  <MessageSquare size={20} />
                  Chat with my AI Assistant
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;