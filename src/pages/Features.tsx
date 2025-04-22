import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  TagIcon, 
  AdjustmentsHorizontalIcon,
  ClockIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      title: 'AI-Generated Summaries',
      description: 'Get instant summaries of your saved links using advanced AI technology.',
      icon: SparklesIcon
    },
    {
      title: 'Customizable Dashboard',
      description: 'Tailor your dashboard to show the information that matters most to you.',
      icon: AdjustmentsHorizontalIcon
    },
    {
      title: 'Smart Tagging',
      description: 'Automatic categorization with AI',
      icon: TagIcon
    },
    {
      title: 'Link Expiration',
      description: 'Set expiration dates for your links to keep your collection fresh.',
      icon: ClockIcon,
      comingSoon: true
    },
    {
      title: 'Browser Extension',
      description: 'Save links directly from your browser with our convenient extension.',
      icon: PuzzlePieceIcon,
      comingSoon: true
    }
  ];

  const testimonials = [
    {
      quote: 'MindLink has transformed how I organize my research. The AI summaries are incredibly accurate!',
      author: 'Sarah Johnson',
      role: 'Research Analyst'
    },
    {
      quote: 'I love how easy it is to find my saved links. The automatic categorization is a game-changer.',
      author: 'Michael Chen',
      role: 'Software Developer'
    },
    {
      quote: 'The browser extension makes saving links so convenient. I use it multiple times a day!',
      author: 'Emily Rodriguez',
      role: 'Content Creator'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Full-width gradient background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          {/* Animated blob background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6"
            >
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Links
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Discover how MindLink's advanced features can transform your link management experience.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  {feature.comingSoon && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">Coming Soon</span>
                  )}
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the AI summarization work?</h3>
              <p className="text-gray-600">MindLink uses advanced AI technology to generate instant summaries of your saved links, helping you quickly understand the content without needing to visit the page.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I delete a link?</h3>
              <p className="text-gray-600">You can delete links directly from your dashboard.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I collaborate with others?</h3>
              <p className="text-gray-600">At this stage, collaboration features are not available. However, it's something we're working on for future updates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Link Management?</h2>
            <p className="text-xl text-indigo-100 mb-8">Starrt organizing your digital life with AI-powered summaries, automatic categorization, and more.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 