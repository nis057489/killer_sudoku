import React from 'react';
import { useGameStore } from '../store';
import { Cell } from './Cell';

export const Board: React.FC = () => {
    const { cells, cages, selectedCellId, selectCell } = useGameStore();

    if (Object.keys(cells).length === 0) return null;

    const getCageId = (r: number, c: number) => cells[`r${r}c${c}`]?.cageId;

    return (
        <div className="w-full max-w-md aspect-square mx-auto p-1">
            <div className="grid grid-cols-9 border-l-2 border-t-2 border-deep-space-blue-600 bg-deep-space-blue-200 shadow-2xl shadow-deep-space-blue-100">
                {Array.from({ length: 9 }).map((_, r) => (
                    Array.from({ length: 9 }).map((_, c) => {
                        const cellId = `r${r}c${c}`;
                        const cell = cells[cellId];

                        // Cage Logic
                        const cage = cages[cell.cageId];
                        const sortedCageCells = [...cage.cells].sort((a, b) => {
                            const [ar, ac] = parseId(a);
                            const [br, bc] = parseId(b);
                            return ar - br || ac - bc;
                        });
                        const showSum = sortedCageCells[0] === cellId;

                        const currentCageId = cell.cageId;
                        const topCageId = r > 0 ? getCageId(r - 1, c) : null;
                        const rightCageId = c < 8 ? getCageId(r, c + 1) : null;
                        const bottomCageId = r < 8 ? getCageId(r + 1, c) : null;
                        const leftCageId = c > 0 ? getCageId(r, c - 1) : null;

                        const borders = {
                            top: currentCageId !== topCageId,
                            right: currentCageId !== rightCageId,
                            bottom: currentCageId !== bottomCageId,
                            left: currentCageId !== leftCageId,
                        };

                        // 3x3 Subgrid Logic
                        const isSubgridRight = (c + 1) % 3 === 0;
                        const isSubgridBottom = (r + 1) % 3 === 0;

                        const selectedValue = selectedCellId ? cells[selectedCellId].value : null;

                        return (
                            <Cell
                                key={cellId}
                                cell={cell}
                                isSelected={selectedCellId === cellId}
                                isSameValue={!!(selectedValue && cell.value === selectedValue)}
                                borders={borders}
                                subgridBorders={{
                                    right: isSubgridRight,
                                    bottom: isSubgridBottom
                                }}
                                cageSum={showSum ? cage.sum : undefined}
                                onClick={() => selectCell(cellId)}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
};

function parseId(id: string) {
    const match = id.match(/r(\d+)c(\d+)/);
    return [parseInt(match![1]), parseInt(match![2])];
}
