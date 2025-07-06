import React from 'react';
import { Check, X, Copy, Loader2, Sparkles } from 'lucide-react';
import { UsernameResult } from '../types';

interface UsernameCardProps {
  result: UsernameResult;
  onCopy: (username: string) => void;
  beautyScore?: number;
}

export default function UsernameCard({ result, onCopy, beautyScore }: UsernameCardProps) {
  const { username, isAvailable, isChecking, error } = result;

  const handleCopy = () => {
    if (isAvailable && !isChecking) {
      onCopy(username);
    }
  };

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-300
      ${isChecking 
        ? 'border-gray-300 bg-gray-50' 
        : isAvailable 
          ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100' 
          : error
            ? 'border-amber-300 bg-amber-50'
            : 'border-red-300 bg-red-50'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isChecking ? (
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            ) : isAvailable ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : error ? (
              <X className="w-5 h-5 text-amber-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
          </div>
          
          <div>
            <p className={`font-mono text-lg font-semibold ${
              isChecking 
                ? 'text-gray-600' 
                : isAvailable 
                  ? 'text-emerald-700' 
                  : error
                    ? 'text-amber-700'
                    : 'text-red-700'
            }`}>
              {username}
            </p>
            <p className={`text-sm ${
              isChecking 
                ? 'text-gray-500' 
                : isAvailable 
                  ? 'text-emerald-600' 
                  : error
                    ? 'text-amber-600'
                    : 'text-red-600'
            }`}>
              {isChecking 
                ? 'Checking...' 
                : isAvailable 
                  ? 'Available' 
                  : error
                    ? 'Error checking'
                    : 'Já registrado'
              }
            </p>
            {typeof beautyScore === 'number' && (
              <div className="flex items-center gap-1 mt-1 text-xs text-purple-700">
                <Sparkles className="w-4 h-4" />
                Beleza: <span className="font-bold">{beautyScore}</span>/100
              </div>
            )}
          </div>
        </div>

        {isAvailable && !isChecking && (
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors duration-200"
            title="Copiar Username"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}