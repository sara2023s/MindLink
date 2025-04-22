import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Lock, LayoutDashboard, Tag, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-indigo-600" />,
      title: "AI Summarization",
      description: "Get instant summaries of any content"
    },
    {
      icon: <Tag className="w-6 h-6 text-indigo-600" />,
      title: "Smart Tagging",
      description: "Automatic categorization with AI"
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-indigo-600" />,
      title: "Visual Link Dashboard",
      description: "Beautiful, intuitive organization"
    },
    {
      icon: <Search className="w-6 h-6 text-indigo-600" />,
      title: "Fast Search",
      description: "Find anything instantly"
    },
    {
      icon: <Lock className="w-6 h-6 text-indigo-600" />,
      title: "Private & Secure",
      description: "Your data stays yours"
    }
  ];

  const steps = [
    {
      title: "Add a Link",
      description: "Paste it, drop it in, or share it to MindLink."
    },
    {
      title: "Let AI Handle It",
      description: "Instantly get a summary, title, and tags — no manual work."
    },
    {
      title: "View in Your Dashboard",
      description: "All your links in one place, searchable and beautifully organized."
    }
  ];

  const testimonials = [
    {
      quote: "MindLink saves me hours every week.",
      author: "Avery R., Student"
    },
    {
      quote: "Finally, a bookmark tool that doesn't suck.",
      author: "Jordan M., Developer"
    },
    {
      quote: "It's like Notion + Pocket + AI, but simple.",
      author: "Tasha P., Content Creator"
    }
  ];

  return (
    <div className="min-h-screen w-full min-w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full min-w-full bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center pt-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">
                Organize Your Mind,<br />One Link at a Time
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-violet-100 max-w-3xl mx-auto text-center">
                MindLink is your intelligent link assistant — summarize, categorize, and search your saved content effortlessly using AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/signup"
                  className="bg-white text-violet-700 px-8 py-4 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-fit"
                >
                  Get Started
                </Link>
                <Link
                  to="/features"
                  className="border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 w-fit"
                >
                  Learn More
                </Link>
              </div>
              <p className="mt-6 text-sm text-violet-200 text-center">
                Built by Sara da Silva. Powered by AI. Part of the buildwithsds.com initiative.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="w-full min-w-full bg-white">
        <div className="py-24 w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-4xl font-bold mb-6 text-violet-900 text-center">Lost in Link Chaos? We've Been There.</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto text-center">
                You're constantly saving links — tutorials, articles, TikToks, memes, ideas — and they end up scattered across your notes, chats, and browser bookmarks. MindLink fixes that. It's the AI-powered solution to organize, remember, and resurface what matters.
              </p>
              <p className="text-xl font-semibold text-violet-700 text-center">
                Turn your digital mess into meaningful knowledge.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="w-full min-w-full bg-violet-50">
        <div className="py-24 w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full mb-16"
            >
              <h2 className="text-4xl font-bold mb-6 text-violet-900 text-center">Core Features</h2>
              <p className="text-xl text-gray-600 text-center">
                Everything you need to organize your digital life
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-violet-100 rounded-xl">
                      {React.cloneElement(feature.icon, { className: "w-6 h-6 text-violet-700" })}
                    </div>
                    <h3 className="text-xl font-semibold ml-4 text-violet-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full min-w-full bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="py-24 relative w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full mb-16"
            >
              <h2 className="text-4xl font-bold mb-6 text-violet-900 text-center">How It Works</h2>
              <p className="text-xl text-gray-600 text-center">
                Your second brain, one link at a time.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 w-full">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-violet-50 p-8 rounded-2xl relative text-center"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-violet-700 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-900 mt-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why MindLink */}
      <section className="w-full min-w-full bg-gradient-to-br from-violet-900 to-violet-800">
        <div className="py-24 w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full text-white"
            >
              <h2 className="text-4xl font-bold mb-12">Why MindLink?</h2>
              <ul className="space-y-6 text-lg text-center sm:text-left max-w-2xl mx-auto">
                <li>Designed for speed and simplicity—add, organize, and revisit links effortlessly</li>
                <li>Never lose a link again—everything stays organized and searchable</li>
                <li>Optimized for all screens—seamless experience on desktop and mobile</li>
                <li>Built for students, creators, researchers, and anyone managing digital chaos</li>
                <li>Your data stays private—no tracking, no selling, just your content</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full min-w-full bg-white">
        <div className="py-24 w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-4xl font-bold mb-16 text-violet-900 text-center">What People Are Saying</h2>
              <div className="grid md:grid-cols-3 gap-8 w-full">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-violet-50 p-8 rounded-2xl relative text-center"
                  >
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-violet-700 text-white rounded-full flex items-center justify-center">
                      "
                    </div>
                    <p className="text-lg text-gray-700 mb-4 mt-4">"{testimonial.quote}"</p>
                    <p className="text-violet-700 font-semibold">— {testimonial.author}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Creator */}
      <section className="w-full min-w-full bg-violet-50">
        <div className="py-24 w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-4xl font-bold mb-6 text-violet-900 text-center">Made by Sara da Silva</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto text-center">
                I'm a Technical Support Engineer and aspiring Software Developer & AI Engineer from New Zealand. I created MindLink because I needed a smarter way to track my digital life — and I figured you might too.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-violet-700 hover:text-violet-900 font-semibold group justify-center"
              >
                More about me
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full min-w-full bg-gradient-to-br from-violet-900 to-violet-800">
        <div className="py-24 w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full text-white"
            >
              <h2 className="text-4xl font-bold mb-6 text-center">Ready to Take Control of Your Digital Brain?</h2>
              <p className="text-xl mb-8 text-violet-100 max-w-3xl mx-auto text-center">
                It's free, instant, and designed to make your life easier.
              </p>
              <Link
                to="/signup"
                className="inline-block bg-white text-violet-700 px-8 py-4 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Using MindLink
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 