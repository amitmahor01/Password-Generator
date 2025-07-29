'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const securityTips = [
  {
    title: "Use a mix of character types",
    description: "Include uppercase, lowercase, numbers, and symbols to increase complexity.",
    icon: "🔤"
  },
  {
    title: "Make it long enough",
    description: "Aim for at least 12 characters. Longer passwords are exponentially harder to crack.",
    icon: "📏"
  },
  {
    title: "Avoid common patterns",
    description: "Don't use sequences like '123', 'abc', or common words like 'password'.",
    icon: "🚫"
  },
  {
    title: "Use unique passwords",
    description: "Never reuse passwords across different accounts or services.",
    icon: "🔐"
  },
  {
    title: "Consider a passphrase",
    description: "Four random words can be more secure and easier to remember than complex passwords.",
    icon: "💭"
  },
  {
    title: "Enable 2FA",
    description: "Use two-factor authentication whenever possible for additional security.",
    icon: "🔒"
  }
];

export default function SecurityTips() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Security Tips
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </motion.button>
      </div>

      <div className="space-y-2">
        {securityTips.slice(0, isExpanded ? securityTips.length : 3).map((tip, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-2 rounded bg-white"
          >
            <span className="text-lg">{tip.icon}</span>
            <div>
              <h4 className="font-medium text-blue-900 text-sm">{tip.title}</h4>
              <p className="text-blue-700 text-xs mt-1">{tip.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              +{securityTips.length - 3} more tips
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 