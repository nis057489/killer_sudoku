import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store';
import { clsx } from 'clsx';

export const Controls: React.FC = () => {
    const { t } = useTranslation();
    const { inputNumber, undo, toggleNoteMode, isNoteMode } = useGameStore();

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
            <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => inputNumber(num)}
                        className="aspect-square bg-deep-space-blue-400 rounded-lg text-2xl font-bold text-sky-blue-light active:bg-deep-space-blue-500 transition-colors touch-manipulation shadow-lg shadow-deep-space-blue-100/50"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={undo}
                    className="aspect-square bg-deep-space-blue-400 rounded-lg flex items-center justify-center active:bg-deep-space-blue-500 font-bold text-sm text-amber-flame transition-colors touch-manipulation shadow-lg shadow-deep-space-blue-100/50"
                >
                    {t('controls.undo')}
                </button>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={toggleNoteMode}
                    className={clsx(
                        "flex-1 py-4 rounded-lg font-bold transition-colors touch-manipulation shadow-lg",
                        isNoteMode
                            ? "bg-amber-flame text-deep-space-blue-100 shadow-amber-flame/20"
                            : "bg-deep-space-blue-400 text-sky-blue-light-600 shadow-deep-space-blue-100/50"
                    )}
                >
                    {isNoteMode ? t('controls.notesOn') : t('controls.notesOff')}
                </button>
            </div>
        </div>
    );
};
