import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  PuzzlePieceIcon, 
  RocketLaunchIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-900">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
            >
              Welcome to MindLink – The Future of Organized Content
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl text-indigo-100 mb-8"
            >
              Created by Sara da Silva – AI Enthusiast, Developer, and Innovator
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto"
            >
              MindLink is designed to help you organize, summarize, and categorize your links with ease. Built with AI, it provides a smarter way to manage your digital content.
            </motion.p>
            <motion.a
              href="#creator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Learn More About the Creator
            </motion.a>
          </div>
        </div>
      </div>

      {/* Meet the Creator Section */}
      <div id="creator" className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Meet the Creator: Sara da Silva
              </motion.h2>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-indigo-600 mb-4"
              >
                A Solo Developer Passionate About Innovation
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-600"
              >
                MindLink was created by Sara da Silva, a Technical Support Engineer based in New Zealand, with a love for AI and creating practical solutions. This project reflects Sara's dedication to crafting efficient, intuitive, and valuable tools for users.
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <UserGroupIcon className="w-32 h-32 text-indigo-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              The Vision Behind MindLink
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-indigo-600 mb-8"
            >
              Solving the Everyday Problem of Digital Clutter
            </motion.h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <SparklesIcon className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Organization</h4>
              <p className="text-gray-600">Leveraging AI to automatically categorize and summarize your content.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <PuzzlePieceIcon className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Intuitive Design</h4>
              <p className="text-gray-600">A user-friendly interface that makes organization effortless.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <RocketLaunchIcon className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Future-Ready</h4>
              <p className="text-gray-600">Built to evolve with your needs and the latest technology.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why MindLink Section */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Why MindLink?
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-indigo-600 mb-8"
            >
              Smarter. Faster. Better.
            </motion.h3>
          </div>
          <div className="max-w-3xl mx-auto">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-gray-600 mb-8 text-center"
            >
              MindLink doesn't just organize your links – it makes your digital content smarter. With AI-powered features like summarization, title generation, and smart categorization, MindLink helps you focus on the big picture, leaving the rest to AI. Whether it's for personal, academic, or professional use, MindLink is the best way to stay on top of your content.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "AI-powered link summaries",
                "Customizable categories for better organization",
                "User-friendly interface with a sleek design",
                "Seamless syncing and fast performance"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-gray-600">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      <div className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Let's Connect!
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-indigo-600 mb-4"
            >
              I'm always open to feedback or just a good tech conversation.
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              If you have any questions about MindLink or want to learn more about my work, feel free to reach out via my portfolio website. I'd love to hear from you!
            </motion.p>
            <motion.a
              href="https://buildwithsds.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>Visit My Portfolio</span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 