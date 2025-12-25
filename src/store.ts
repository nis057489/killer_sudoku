import { create } from 'zustand';
import type { GameState, Difficulty, Cell, CompactPuzzleData, Cage } from './types';
import puzzlesData from './data/puzzles.json';

interface GameStore extends GameState {
  startGame: (difficulty: Difficulty) => void;
  selectCell: (cellId: string) => void;
  inputNumber: (num: number) => void;
  toggleNoteMode: () => void;
  undo: () => void;
  checkCompletion: () => void;
}

// Helper to deep copy state for history
const serializeState = (state: GameState) => JSON.stringify({
  cells: state.cells,
  isComplete: state.isComplete
});

const MAX_MISTAKES: Record<Difficulty, number> = {
  easy: 7,
  medium: 5,
  hard: 3
};

export const useGameStore = create<GameStore>((set, get) => ({
  puzzleId: '',
  difficulty: 'easy',
  cells: {},
  cages: {},
  selectedCellId: null,
  history: [],
  historyIndex: -1,
  isNoteMode: false,
  timer: 0,
  isComplete: false,
  isGameOver: false,
  mistakes: 0,

  startGame: (difficulty) => {
    const puzzles = (puzzlesData as Record<string, CompactPuzzleData[]>)[difficulty];
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    
    const cells: Record<string, Cell> = {};
    const cages: Record<string, Cage> = {};

    // Initialize cages
    puzzle.c.forEach((sum, index) => {
      const cageId = `cage-${index}`;
      cages[cageId] = {
        id: cageId,
        sum,
        cells: []
      };
    });

    // Initialize cells
    for (let i = 0; i < 81; i++) {
      const r = Math.floor(i / 9);
      const c = i % 9;
      const id = `r${r}c${c}`;
      const cageIndex = puzzle.m[i];
      const cageId = `cage-${cageIndex}`;
      const solution = parseInt(puzzle.s[i]);

      cells[id] = {
        id,
        row: r,
        col: c,
        value: null,
        solution,
        cageId,
        notes: [],
        isGiven: false
      };

      // Add cell to cage
      if (cages[cageId]) {
        cages[cageId].cells.push(id);
      }
    }

    set({
      puzzleId: puzzle.id,
      difficulty,
      cells,
      cages,
      selectedCellId: null,
      history: [],
      historyIndex: -1,
      isNoteMode: false,
      timer: 0,
      isComplete: false,
      isGameOver: false,
      mistakes: 0
    });
  },

  selectCell: (cellId) => set({ selectedCellId: cellId }),

  inputNumber: (num) => {
    const { selectedCellId, cells, isNoteMode, history, historyIndex, isGameOver, difficulty, mistakes } = get();
    if (!selectedCellId || cells[selectedCellId].isGiven || isGameOver) return;

    const newCells = { ...cells };
    const cell = { ...newCells[selectedCellId] };

    // Save history
    const currentHistory = history.slice(0, historyIndex + 1);
    currentHistory.push(serializeState(get()));

    let newMistakes = mistakes;
    let newIsGameOver: boolean = isGameOver;

    if (isNoteMode) {
      if (cell.notes.includes(num)) {
        cell.notes = cell.notes.filter(n => n !== num);
      } else {
        cell.notes = [...cell.notes, num];
      }
    } else {
      if (cell.value === num) {
        cell.value = null; // Toggle off
      } else {
        cell.value = num;
        // Check for mistake immediately
        if (cell.value !== cell.solution) {
           newMistakes = mistakes + 1;
           if (newMistakes >= MAX_MISTAKES[difficulty]) {
             newIsGameOver = true;
           }
        }
      }
    }

    newCells[selectedCellId] = cell;
    
    set({ 
      cells: newCells, 
      history: currentHistory, 
      historyIndex: currentHistory.length - 1,
      mistakes: newMistakes,
      isGameOver: newIsGameOver
    });

    if (!newIsGameOver) {
      get().checkCompletion();
    }
  },

  toggleNoteMode: () => set(state => ({ isNoteMode: !state.isNoteMode })),

  undo: () => {
    const { history, historyIndex, isGameOver } = get();
    if (historyIndex < 0 || isGameOver) return;

    const prevState = JSON.parse(history[historyIndex]);
    set({
      cells: prevState.cells,
      isComplete: prevState.isComplete,
      historyIndex: historyIndex - 1
    });
  },

  checkCompletion: () => {
    const { cells } = get();
    const allFilled = Object.values(cells).every(c => c.value !== null);
    if (!allFilled) return;

    const allCorrect = Object.values(cells).every(c => c.value === c.solution);
    if (allCorrect) {
      set({ isComplete: true });
    }
  }
}));
