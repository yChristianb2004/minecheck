import React, { useState } from 'react';
import { UsernameResult } from '../types';
import UsernameCard from './UsernameCard';
import { beautyScore } from '../utils/minecraftApi';

interface UsernameGridProps {
  results: UsernameResult[];
  onCopy: (username: string) => void;
}

export default function UsernameGrid({ results, onCopy }: UsernameGridProps) {
  const [showBeauty, setShowBeauty] = useState(false);

  if (results.length === 0) {
    return null;
  }

  const availableCount = results.filter(r => r.isAvailable && !r.isChecking).length;
  const checkedCount = results.filter(r => !r.isChecking).length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <p className="text-lg text-gray-700">
          <span className="font-semibold text-emerald-600">{availableCount}</span> available out of{' '}
          <span className="font-semibold">{checkedCount}</span> checked usernames
        </p>
        <button
          className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
          onClick={() => setShowBeauty(v => !v)}
        >
          {showBeauty ? 'Ocultar Beleza' : 'Avaliar Beleza'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((result) => (
          <UsernameCard
            key={result.username}
            result={result}
            onCopy={onCopy}
            beautyScore={showBeauty ? beautyScore(result.username) : undefined}
          />
        ))}
      </div>
    </div>
  );
}