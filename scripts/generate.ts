import fs from 'fs';
import path from 'path';
import { CompactPuzzleData, Difficulty } from '../src/types';

const ROWS = 9;
const COLS = 9;
const NUM_GAMES = 1000;

function generateSudoku(): number[][] {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  fillGrid(grid);
  return grid;
}

function fillGrid(grid: number[][]): boolean {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (grid[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

function shuffle(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateCages(grid: number[][]): { id: string; sum: number; cells: string[] }[] {
  const visited = new Set<string>();
  const cages: { id: string; sum: number; cells: string[] }[] = [];
  let cageCounter = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellId = `r${r}c${c}`;
      if (visited.has(cellId)) continue;

      const cageSize = Math.floor(Math.random() * 4) + 2; // Random size 2-5
      const currentCageCells: string[] = [cellId];
      const currentCageValues = new Set<number>([grid[r][c]]);
      visited.add(cellId);

      let attempts = 0;
      while (currentCageCells.length < cageSize && attempts < 10) {
        // Try to find a neighbor
        const neighbors = getNeighbors(currentCageCells, visited);
        if (neighbors.length === 0) break;

        const nextCellId = neighbors[Math.floor(Math.random() * neighbors.length)];
        const [nr, nc] = parseCellId(nextCellId);
        const val = grid[nr][nc];

        if (!currentCageValues.has(val)) {
          currentCageCells.push(nextCellId);
          currentCageValues.add(val);
          visited.add(nextCellId);
        }
        attempts++;
      }

      const sum = Array.from(currentCageValues).reduce((a, b) => a + b, 0);
      cages.push({
        id: `cage-${cageCounter++}`,
        sum,
        cells: currentCageCells,
      });
    }
  }
  return cages;
}

function getNeighbors(currentCells: string[], visited: Set<string>): string[] {
  const neighbors: string[] = [];
  for (const cellId of currentCells) {
    const [r, c] = parseCellId(cellId);
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
        const nid = `r${nr}c${nc}`;
        if (!visited.has(nid) && !currentCells.includes(nid)) {
          neighbors.push(nid);
        }
      }
    }
  }
  return neighbors;
}

function parseCellId(id: string): [number, number] {
  const match = id.match(/r(\d+)c(\d+)/);
  if (!match) throw new Error(`Invalid cell ID: ${id}`);
  return [parseInt(match[1]), parseInt(match[2])];
}

function generatePuzzle(difficulty: Difficulty): CompactPuzzleData {
  const grid = generateSudoku();
  const cages = generateCages(grid);
  
  // 1. Solution String
  let s = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      s += grid[r][c];
    }
  }

  // 2. Cage Map & Sums
  const m = new Array(81).fill(0);
  const cSums: number[] = [];

  cages.forEach((cage, index) => {
    cSums.push(cage.sum);
    cage.cells.forEach(cellId => {
      const [r, col] = parseCellId(cellId);
      const cellIndex = r * 9 + col;
      m[cellIndex] = index;
    });
  });

  return {
    id: Math.random().toString(36).substring(7),
    d: difficulty,
    s,
    m,
    c: cSums
  };
}

const puzzles: Record<string, CompactPuzzleData[]> = {
  easy: [],
  medium: [],
  hard: []
};

console.log('Generating puzzles...');
for (let i = 0; i < NUM_GAMES; i++) puzzles.easy.push(generatePuzzle('easy'));
for (let i = 0; i < NUM_GAMES; i++) puzzles.medium.push(generatePuzzle('medium'));
for (let i = 0; i < NUM_GAMES; i++) puzzles.hard.push(generatePuzzle('hard'));

const outputPath = path.resolve(process.cwd(), 'src/data/puzzles.json');
fs.writeFileSync(outputPath, JSON.stringify(puzzles, null, 2));
console.log(`Generated ${NUM_GAMES * 3} puzzles to ${outputPath}`);
