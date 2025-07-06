import React from 'react';
import { Zap, Square, TrendingUp } from 'lucide-react';

interface SuperSearchButtonProps {
  selectedLetter: string;
  isSuperSearching: boolean;
  superSearchStats: {
    checked: number;
    found: number;
    speed: number;
  };
  onStart: (value: string, isWord?: boolean) => void;
  onStop: () => void;
  isWordMode?: boolean; // novo
}

export default function SuperSearchButton({ 
  selectedLetter, 
  isSuperSearching, 
  superSearchStats,
  onStart, 
  onStop,
  isWordMode = false
}: SuperSearchButtonProps) {
  if (!selectedLetter) return null;

  return (
    <div className="text-center mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 max-w-md mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Super Busca
          </h3>
          <p className="text-sm text-gray-600">
            {isWordMode
              ? <>Buscar usernames automaticamente relacionados à palavra <span className="font-semibold text-purple-600">{selectedLetter}</span>.</>
              : <>Buscar usernames automaticamente com a letra <span className="font-semibold text-purple-600">{selectedLetter}</span>.</>
            }
          </p>
        </div>

        {isSuperSearching && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-700">{superSearchStats.checked}</div>
                <div className="text-xs text-purple-600">Verificados</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-700">{superSearchStats.found}</div>
                <div className="text-xs text-emerald-600">Encontrados</div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-600" />
                <div>
                  <div className="text-lg font-bold text-blue-700">{superSearchStats.speed}</div>
                  <div className="text-xs text-blue-600">por/seg</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={isSuperSearching ? onStop : () => onStart(selectedLetter, isWordMode)}
          className={`
            w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${isSuperSearching
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300'
            }
          `}
        >
          {isSuperSearching ? (
            <>
              <Square className="w-5 h-5" />
              Parar Super Busca
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Iniciar Super Busca
            </>
          )}
        </button>

        {isSuperSearching && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              {isWordMode
                ? <>Buscando usernames relacionados a "{selectedLetter}"...</>
                : <>Buscando usernames com "{selectedLetter}"...</>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}