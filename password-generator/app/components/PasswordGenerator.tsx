'use client';

import { useState } from 'react';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
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

  const handleGeneratePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const password = generatePassword(passwordOptions);
    setGeneratedPassword(password);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (generatedPassword && generatedPassword !== "Please select at least one character type" && generatedPassword !== "Length must be between 4-50") {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password || password.includes("Please select") || password.includes("Length must be")) {
      return { strength: 'none', color: 'text-gray-400', bgColor: 'bg-gray-200' };
    }
    
    let score = 0;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    if (score <= 2) return { strength: 'Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (score <= 4) return { strength: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score <= 5) return { strength: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    return { strength: 'Strong', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const strength = getPasswordStrength(generatedPassword);

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-gray-500 to-gray-700 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl text-gray-800 text-center mb-6 font-bold uppercase tracking-wider">
          Password Generator
        </h2>
        
        <form onSubmit={handleGeneratePassword} className="space-y-6">
          {/* Password Length */}
          <div>
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
          </div>
          
          {/* Character Options */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium mb-2">Character Types:</label>
            <div className="space-y-2">
              {[
                { key: 'includeUppercase', label: 'Uppercase Letters (A-Z)' },
                { key: 'includeLowercase', label: 'Lowercase Letters (a-z)' },
                { key: 'includeNumbers', label: 'Numbers (0-9)' },
                { key: 'includeSymbols', label: 'Symbols (!@#$%^&*)' }
              ].map((option) => (
                <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
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
                </label>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 shadow-lg w-full"
            >
              Generate Password
            </button>
          </div>
        </form>
        
        {/* Generated Password Display */}
        {generatedPassword && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-lg font-mono text-gray-800 break-all pr-2">
                  {generatedPassword}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-2 text-blue-500 hover:text-blue-700 transition-colors"
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
                </button>
              </div>
            </div>
            
            {/* Password Strength Indicator */}
            {strength.strength !== 'none' && (
              <div className={`p-3 rounded-lg ${strength.bgColor}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${strength.color}`}>
                    Password Strength: {strength.strength}
                  </span>
                </div>
              </div>
            )}
            
            {copied && (
              <div className="text-center text-green-600 font-medium">
                Password copied to clipboard!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 