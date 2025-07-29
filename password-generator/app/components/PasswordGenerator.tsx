'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordDisplay from './PasswordDisplay';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import PasswordHistory from './PasswordHistory';
import SecurityTips from './SecurityTips';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

interface PasswordHistoryItem {
  id: string;
  password: string;
  timestamp: Date;
  length: number;
  strength: string;
}

// Type for localStorage data structure
interface StoredHistoryItem {
  id: string;
  password: string;
  timestamp: string; // ISO string format
  length: number;
  strength: string;
}

export default function PasswordGenerator() {
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistoryItem[]>([]);

  // Load password history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('passwordHistory');
    if (savedHistory) {
      try {
        const parsed: StoredHistoryItem[] = JSON.parse(savedHistory);
        setPasswordHistory(parsed.map((item: StoredHistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load password history:', error);
      }
    }
  }, []);

  // Save password history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
  }, [passwordHistory]);

  const generatePassword = (options: PasswordOptions) => {
    let characters = '';
    
    if (options.includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeNumbers) characters += '0123456789';
    if (options.includeSymbols) characters += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    if (characters === '') {
      return "Please select at least one character type";
    }
    
    if (options.length < 4 || options.length > 50) {
      return "Length must be between 4-50";
    }
    
    let password = '';
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    
    return password;
  };

  const getPasswordStrength = (password: string): string => {
    if (!password || password.includes("Please select") || password.includes("Length must be")) {
      return 'Very Weak';
    }
    
    let score = 0;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    if (score <= 2) return 'Very Weak';
    if (score <= 4) return 'Weak';
    if (score <= 5) return 'Fair';
    if (score <= 6) return 'Good';
    return 'Strong';
  };

  const handleGeneratePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const password = generatePassword(passwordOptions);
    setGeneratedPassword(password);
    setCopied(false);

    // Add to history if it's a valid password
    if (password && !password.includes("Please select") && !password.includes("Length must be")) {
      const newHistoryItem: PasswordHistoryItem = {
        id: Date.now().toString(),
        password,
        timestamp: new Date(),
        length: password.length,
        strength: getPasswordStrength(password)
      };
      
      setPasswordHistory(prev => [...prev, newHistoryItem].slice(-20)); // Keep only last 20
    }
  };

  const copyToClipboard = async (passwordToCopy: string = generatedPassword) => {
    if (passwordToCopy && passwordToCopy !== "Please select at least one character type" && passwordToCopy !== "Length must be between 4-50") {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(passwordToCopy);
        } else {
          // fallback for older browsers and insecure contexts
          const textArea = document.createElement("textarea");
          textArea.value = passwordToCopy;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  const deleteFromHistory = (id: string) => {
    setPasswordHistory(prev => prev.filter(item => item.id !== id));
  };

  const exportHistory = () => {
    if (passwordHistory.length === 0) return;

    const exportData = passwordHistory.map(item => ({
      password: item.password,
      length: item.length,
      strength: item.strength,
      generated: item.timestamp.toLocaleString()
    }));

    const content = exportData.map(item => 
      `Password: ${item.password}\nLength: ${item.length}\nStrength: ${item.strength}\nGenerated: ${item.generated}\n`
    ).join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-gray-500 to-gray-700 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl"
      >
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl text-gray-800 text-center mb-6 font-bold uppercase tracking-wider"
        >
          Password Generator
        </motion.h2>
        
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleGeneratePassword} 
          className="space-y-6"
        >
          {/* Password Length */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label htmlFor="password-length" className="block text-gray-700 font-medium mb-2">
              Password Length: {passwordOptions.length}
            </label>
            <input
              type="range"
              id="password-length"
              min="4"
              max="50"
              value={passwordOptions.length}
              onChange={(e) => setPasswordOptions({...passwordOptions, length: Number(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>50</span>
            </div>
          </motion.div>
          
          {/* Character Options */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-3"
          >
            <label className="block text-gray-700 font-medium mb-2">Character Types:</label>
            <div className="space-y-2">
              {[
                { key: 'includeUppercase', label: 'Uppercase Letters (A-Z)' },
                { key: 'includeLowercase', label: 'Lowercase Letters (a-z)' },
                { key: 'includeNumbers', label: 'Numbers (0-9)' },
                { key: 'includeSymbols', label: 'Symbols (!@#$%^&*)' }
              ].map((option, index) => (
                <motion.label 
                  key={option.key} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={passwordOptions[option.key as keyof PasswordOptions] as boolean}
                    onChange={(e) => setPasswordOptions({
                      ...passwordOptions,
                      [option.key]: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
          
          {/* Generate Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 shadow-lg w-full"
            >
              Generate Password
            </motion.button>
          </motion.div>
        </motion.form>
        
        {/* Generated Password Display */}
        <AnimatePresence>
          {generatedPassword && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <PasswordDisplay 
                password={generatedPassword}
                onCopy={() => copyToClipboard()}
                copied={copied}
              />
              
              {/* Password Strength Meter */}
              <PasswordStrengthMeter password={generatedPassword} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password History */}
        <AnimatePresence>
          {passwordHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PasswordHistory 
                history={passwordHistory}
                onCopy={copyToClipboard}
                onDelete={deleteFromHistory}
                onExport={exportHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <SecurityTips />
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 