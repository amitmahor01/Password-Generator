'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordDisplayProps {
  password: string;
  onCopy: () => void;
  copied: boolean;
}

export default function PasswordDisplay({ password, onCopy, copied }: PasswordDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!password) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-3">
          <motion.p 
            key={isVisible ? 'visible' : 'hidden'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-mono text-gray-800 break-all"
          >
            {isVisible ? password : '•'.repeat(password.length)}
          </motion.p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Reveal/Hide Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </motion.button>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCopy}
            className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-green-600 font-medium mt-2 text-sm"
          >
            Password copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 