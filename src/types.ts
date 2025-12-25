export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  id: string; // "r0c0"
  row: number;
  col: number;
  value: number | null;
  solution: number;
  cageId: string;
  notes: number[];
  isGiven: boolean;
}

export interface Cage {
  id: string;
  sum: number;
  cells: string[]; // Array of cell IDs
}

export interface PuzzleData {
  id: string;
  difficulty: Difficulty;
  cells: {
    id: string;
    solution: number;
    cageId: string;
  }[];
  cages: {
    id: string;
    sum: number;
    cells: string[];
  }[];
}

export interface CompactPuzzleData {
  id: string;
  d: Difficulty;
  s: string;     // solution string "123..."
  m: number[];   // cage map: cellIndex -> cageIndex
  c: number[];   // cage sums: cageIndex -> sum
}

export interface GameState {
  puzzleId: string;
  difficulty: Difficulty;
  cells: Record<string, Cell>;
  cages: Record<string, Cage>;
  selectedCellId: string | null;
  history: string[]; // Serialized state for undo
  historyIndex: number;
  isNoteMode: boolean;
  timer: number;
  isComplete: boolean;
  isGameOver: boolean;
  mistakes: number;
}
