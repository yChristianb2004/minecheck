import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Header from './components/Header';
import LetterSelector from './components/LetterSelector';
import CharacterLengthSelector from './components/CharacterLengthSelector';
import SuperSearchButton from './components/SuperSearchButton';
import UsernameGrid from './components/UsernameGrid';
import { useUsernameChecker } from './hooks/useUsernameChecker';

function App() {
  const [selectedLetter, setSelectedLetter] = useState('');
  const [minLength, setMinLength] = useState(3);
  const [maxLength, setMaxLength] = useState(8);
  const [customWord, setCustomWord] = useState('');
  const [randomSide, setRandomSide] = useState<'before' | 'after'>('after'); // novo estado

  const {
    results,
    isGenerating,
    isSuperSearching,
    superSearchStats,
    checkUsernames,
    startSuperSearch,
    stopSuperSearch,
    copyUsername,
    checkRelatedUsernames,
    startSuperSearchRelated // novo
  } = useUsernameChecker();

  const handleLetterSelect = (letter: string) => {
    if (isSuperSearching) {
      stopSuperSearch();
    }
    setSelectedLetter(letter);
    setCustomWord('');
    checkUsernames(letter, minLength, maxLength);
  };

  const handleCustomWord = (word: string) => {
    if (isSuperSearching) {
      stopSuperSearch();
    }
    setCustomWord(word);
    setSelectedLetter('');
    checkRelatedUsernames(word, minLength, maxLength, randomSide);
  };

  const handleRefresh = () => {
    if (selectedLetter && !isGenerating && !isSuperSearching) {
      checkUsernames(selectedLetter, minLength, maxLength);
    } else if (customWord && !isGenerating && !isSuperSearching) {
      checkRelatedUsernames(customWord, minLength, maxLength, randomSide);
    }
  };

  const handleMinLengthChange = (length: number) => {
    setMinLength(length);
    if (length > maxLength) {
      setMaxLength(length);
    }
  };

  const handleMaxLengthChange = (length: number) => {
    setMaxLength(length);
  };

  const handleSuperSearchStart = (value: string, isWord?: boolean) => {
    if (isWord) {
      startSuperSearchRelated(value, minLength, maxLength, randomSide);
    } else {
      startSuperSearch(value, minLength, maxLength);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Caixa de pesquisa para palavra personalizada */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Digite uma palavra (ex: Sky, Fire, Block...)"
            value={customWord}
            onChange={e => handleCustomWord(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={isSuperSearching}
          />
        </div>

        {/* Botões para alternar lado dos nomes aleatórios */}
        {customWord && !selectedLetter && (
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 rounded-l-lg font-semibold border ${randomSide === 'before' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => {
                setRandomSide('before');
                if (customWord) checkRelatedUsernames(customWord, minLength, maxLength, 'before');
              }}
              disabled={isGenerating}
            >
              Aleatório antes
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg font-semibold border-t border-b border-r ${randomSide === 'after' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => {
                setRandomSide('after');
                if (customWord) checkRelatedUsernames(customWord, minLength, maxLength, 'after');
              }}
              disabled={isGenerating}
            >
              Aleatório depois
            </button>
          </div>
        )}

        <LetterSelector
          selectedLetter={selectedLetter}
          onLetterSelect={handleLetterSelect}
          onCustomWord={handleCustomWord}
        />

        <CharacterLengthSelector
          minLength={minLength}
          maxLength={maxLength}
          onMinLengthChange={handleMinLengthChange}
          onMaxLengthChange={handleMaxLengthChange}
        />

        {/* SuperSearch para letra OU palavra */}
        <SuperSearchButton
          selectedLetter={selectedLetter || customWord}
          isSuperSearching={isSuperSearching}
          superSearchStats={superSearchStats}
          onStart={handleSuperSearchStart}
          onStop={stopSuperSearch}
          isWordMode={!!customWord && !selectedLetter}
        />

        {(selectedLetter || customWord) && !isSuperSearching && (
          <div className="text-center mb-8">
            <button
              onClick={handleRefresh}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating ? 'Generating & Checking...' : 'Generate New Usernames'}
              </span>
            </button>
          </div>
        )}

        <UsernameGrid results={results} onCopy={copyUsername} />

        {results.length === 0 && (selectedLetter || customWord) && !isSuperSearching && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-lg">
                {selectedLetter
                  ? `Generating usernames starting with "${selectedLetter}"...`
                  : `Generating usernames related to "${customWord}"...`
                }
              </span>
            </div>
          </div>
        )}

        {!selectedLetter && !customWord && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Select a letter or type a word to start finding available Minecraft usernames
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;