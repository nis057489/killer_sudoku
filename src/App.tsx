import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from './store';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import type { Difficulty } from './types';

function App() {
  const { t, i18n } = useTranslation();
  const { puzzleId, startGame, mistakes, isComplete, isGameOver, difficulty } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!puzzleId) {
      startGame('easy');
    }
  }, [puzzleId, startGame]);

  if (!puzzleId) return <div className="flex items-center justify-center h-screen">{t('loading')}</div>;

  const maxMistakes = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 5 : 7;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col bg-deep-space-blue-100 text-sky-blue-light-900 pb-safe">
      <header className="p-4 flex justify-between items-center max-w-md mx-auto w-full">
        <div>
          <h1 className="text-xl font-bold text-amber-flame">{t('appTitle')}</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-sky-blue-light-600 capitalize">{t(`difficulty.${difficulty}`)}</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className={mistakes >= maxMistakes - 1 ? "text-red-500 font-bold text-sm font-mono" : "text-red-400 text-sm font-mono"}>
            {t('mistakes', { current: mistakes, max: maxMistakes })}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg bg-deep-space-blue-400 hover:bg-deep-space-blue-500 transition-colors"
            aria-label={t('settings.label')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-blue-light">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        <Board />
      </main>

      <footer className="pb-8">
        <Controls />
      </footer>

      {showSettings && (
        <div className="fixed inset-0 bg-deep-space-blue-100/90 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div className="bg-deep-space-blue-300 p-6 rounded-xl w-full max-w-xs border border-deep-space-blue-500 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-amber-flame text-center">{t('settings.title')}</h2>

            <div className="flex flex-col gap-3 mb-6">
              <p className="text-sm text-sky-blue-light-600 text-center mb-1">{t('settings.startNewGame')}</p>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    startGame(diff);
                    setShowSettings(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-bold capitalize transition-colors flex justify-between items-center ${difficulty === diff
                    ? 'bg-blue-green text-deep-space-blue-100 ring-2 ring-amber-flame'
                    : 'bg-deep-space-blue-400 text-sky-blue-light hover:bg-deep-space-blue-500'
                    }`}
                >
                  {t(`difficulty.${diff}`)}
                  {difficulty === diff && <span>✓</span>}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-sky-blue-light-600 text-center mb-1">{t('settings.language')}</p>
              <div className="relative">
                <select
                  value={i18n.language.split('-')[0]}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-bold bg-deep-space-blue-400 text-sky-blue-light appearance-none cursor-pointer hover:bg-deep-space-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-flame"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="zh">中文</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-sky-blue-light">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-2 text-sky-blue-light-600 hover:text-sky-blue-light transition-colors"
            >
              {t('settings.close')}
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 bg-deep-space-blue-100/90 flex items-center justify-center z-50">
          <div className="bg-deep-space-blue-300 p-8 rounded-xl text-center border border-red-500 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-red-500">{t('gameOver.title')}</h2>
            <p className="mb-6 text-sky-blue-light-700">{t('gameOver.message')}</p>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-sky-blue-light-600 mb-2">{t('gameOver.tryAgain')}</p>
              <div className="flex gap-2 justify-center">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => startGame(diff)}
                    className="px-4 py-2 bg-princeton-orange hover:bg-princeton-orange-600 text-deep-space-blue-100 font-bold rounded capitalize transition-colors"
                  >
                    {t(`difficulty.${diff}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="fixed inset-0 bg-deep-space-blue-100/90 flex items-center justify-center z-50">
          <div className="bg-deep-space-blue-300 p-8 rounded-xl text-center border border-deep-space-blue-500 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-blue-green-700">{t('solved.title')}</h2>
            <p className="mb-6 text-sky-blue-light-700">{t('solved.message')}</p>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-sky-blue-light-600 mb-2">{t('solved.playAgain')}</p>
              <div className="flex gap-2 justify-center">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => startGame(diff)}
                    className="px-4 py-2 bg-princeton-orange hover:bg-princeton-orange-600 text-deep-space-blue-100 font-bold rounded capitalize transition-colors"
                  >
                    {t(`difficulty.${diff}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
