import React from 'react';
import { Hash } from 'lucide-react';

interface CharacterLengthSelectorProps {
  minLength: number;
  maxLength: number;
  onMinLengthChange: (length: number) => void;
  onMaxLengthChange: (length: number) => void;
}

export default function CharacterLengthSelector({ 
  minLength, 
  maxLength, 
  onMinLengthChange, 
  onMaxLengthChange 
}: CharacterLengthSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center justify-center mb-4">
          <Hash className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Tamanho dos Usernames
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mínimo de caracteres
            </label>
            <div className="relative">
              <select
                value={minLength}
                onChange={(e) => onMinLengthChange(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {Array.from({ length: 14 }, (_, i) => i + 3).map(length => (
                  <option key={length} value={length}>
                    {length} caracteres
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de caracteres
            </label>
            <div className="relative">
              <select
                value={maxLength}
                onChange={(e) => onMaxLengthChange(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {Array.from({ length: 16 - minLength + 1 }, (_, i) => i + minLength).map(length => (
                  <option key={length} value={length}>
                    {length} caracteres
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            Usernames terão entre <span className="font-semibold">{minLength}</span> e{' '}
            <span className="font-semibold">{maxLength}</span> caracteres
          </p>
        </div>
      </div>
    </div>
  );
}