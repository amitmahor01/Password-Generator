'use client';

import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number;
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
  bgColor: string;
  barColor: string;
  entropy: number;
  feedback: string[];
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateEntropy = (password: string): number => {
    if (!password) return 0;
    
    let charsetSize = 0;
    if (password.match(/[a-z]/)) charsetSize += 26;
    if (password.match(/[A-Z]/)) charsetSize += 26;
    if (password.match(/[0-9]/)) charsetSize += 10;
    if (password.match(/[^A-Za-z0-9]/)) charsetSize += 32; // Common symbols
    
    return Math.log2(Math.pow(charsetSize, password.length));
  };

  const analyzePassword = (password: string): StrengthResult => {
    if (!password || password.includes("Please select") || password.includes("Length must be")) {
      return {
        score: 0,
        strength: 'Very Weak',
        color: 'text-gray-400',
        bgColor: 'bg-gray-100',
        barColor: 'bg-gray-300',
        entropy: 0,
        feedback: []
      };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length checks
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length < 8) feedback.push("Consider using at least 8 characters");

    // Character variety checks
    if (password.match(/[a-z]/)) score += 1;
    else feedback.push("Add lowercase letters");
    
    if (password.match(/[A-Z]/)) score += 1;
    else feedback.push("Add uppercase letters");
    
    if (password.match(/[0-9]/)) score += 1;
    else feedback.push("Add numbers");
    
    if (password.match(/[^A-Za-z0-9]/)) score += 1;
    else feedback.push("Add special characters");

    // Complexity checks
    if (password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)) score += 2;
    
    // Avoid common patterns
    if (password.match(/(.)\1{2,}/)) {
      score -= 1;
      feedback.push("Avoid repeating characters");
    }
    
    if (password.match(/(123|abc|qwe|password|admin)/i)) {
      score -= 2;
      feedback.push("Avoid common patterns");
    }

    const entropy = calculateEntropy(password);
    
    // Determine strength level
    let strength: StrengthResult['strength'];
    let color: string;
    let bgColor: string;
    let barColor: string;

    if (score <= 2 || entropy < 30) {
      strength = 'Very Weak';
      color = 'text-red-600';
      bgColor = 'bg-red-50';
      barColor = 'bg-red-500';
    } else if (score <= 4 || entropy < 50) {
      strength = 'Weak';
      color = 'text-orange-600';
      bgColor = 'bg-orange-50';
      barColor = 'bg-orange-500';
    } else if (score <= 6 || entropy < 70) {
      strength = 'Fair';
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
      barColor = 'bg-yellow-500';
    } else if (score <= 8 || entropy < 90) {
      strength = 'Good';
      color = 'text-blue-600';
      bgColor = 'bg-blue-50';
      barColor = 'bg-blue-500';
    } else if (score <= 10 || entropy < 120) {
      strength = 'Strong';
      color = 'text-green-600';
      bgColor = 'bg-green-50';
      barColor = 'bg-green-500';
    } else {
      strength = 'Very Strong';
      color = 'text-emerald-600';
      bgColor = 'bg-emerald-50';
      barColor = 'bg-emerald-500';
    }

    return {
      score: Math.max(0, Math.min(score, 12)),
      strength,
      color,
      bgColor,
      barColor,
      entropy: Math.round(entropy),
      feedback: feedback.slice(0, 3) // Limit to 3 suggestions
    };
  };

  const result = analyzePassword(password);

  if (result.score === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg ${result.bgColor} border border-gray-200`}
    >
      <div className="space-y-3">
        {/* Strength Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className={`font-medium ${result.color}`}>
              Password Strength: {result.strength}
            </span>
            <span className="text-sm text-gray-600">
              {result.score}/12 points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-2 rounded-full ${result.barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${(result.score / 12) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Entropy */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-between items-center"
        >
          <span className="text-sm text-gray-600">Entropy:</span>
          <span className={`font-mono ${result.color}`}>
            {result.entropy} bits
          </span>
        </motion.div>

        {/* Feedback */}
        {result.feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-sm text-gray-600 block mb-1">Suggestions:</span>
            <ul className="text-sm space-y-1">
              {result.feedback.map((suggestion, index) => (
                <motion.li 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="text-gray-700 flex items-center"
                >
                  <span className="text-red-500 mr-2">•</span>
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Entropy Explanation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xs text-gray-500 bg-white p-2 rounded border"
        >
          <strong>Entropy:</strong> Measures password randomness. Higher values indicate stronger passwords.
          {result.entropy >= 90 && " Excellent entropy!"}
          {result.entropy >= 70 && result.entropy < 90 && " Good entropy."}
          {result.entropy >= 50 && result.entropy < 70 && " Fair entropy."}
          {result.entropy < 50 && " Consider increasing complexity."}
        </motion.div>
      </div>
    </motion.div>
  );
} 