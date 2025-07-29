'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordHistoryItem {
  id: string;
  password: string;
  timestamp: Date;
  length: number;
  strength: string;
}

interface PasswordHistoryProps {
  history: PasswordHistoryItem[];
  onCopy: (password: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

export default function PasswordHistory({ history, onCopy, onDelete, onExport }: PasswordHistoryProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (history.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Password History ({history.length})
        </h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVisible(!isVisible)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            {isVisible ? 'Hide' : 'Show'} History
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="text-green-500 hover:text-green-700 text-sm font-medium"
          >
            Export
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 max-h-60 overflow-y-auto"
          >
            {history.slice(-10).reverse().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 mr-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-gray-700">
                      {item.password.substring(0, 8)}...
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.length} chars
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {item.strength}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.timestamp.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onCopy(item.password)}
                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Copy password"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete from history"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 