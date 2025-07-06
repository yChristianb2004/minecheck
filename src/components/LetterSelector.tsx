import React from 'react';

interface LetterSelectorProps {
  selectedLetter: string;
  onLetterSelect: (letter: string) => void;
}

export default function LetterSelector({ selectedLetter, onLetterSelect }: LetterSelectorProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Escolha uma letra
      </h2>
      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2 mb-4">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => onLetterSelect(letter)}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-lg font-bold
              transition-all duration-200 hover:scale-105 active:scale-95
              ${selectedLetter === letter
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm border border-gray-200'
              }
            `}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}