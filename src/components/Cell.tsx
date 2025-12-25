import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { Cell as CellType } from '../types';

interface CellProps {
    cell: CellType;
    isSelected: boolean;
    isSameValue: boolean;
    borders: { top: boolean; right: boolean; bottom: boolean; left: boolean };
    subgridBorders: { right: boolean; bottom: boolean };
    cageSum?: number;
    onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ cell, isSelected, isSameValue, borders, subgridBorders, cageSum, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={twMerge(
                "relative flex items-center justify-center text-2xl font-bold select-none cursor-pointer transition-colors duration-75",
                "w-full h-full aspect-square",
                "bg-deep-space-blue-300 text-sky-blue-light-900",
                isSelected && "bg-blue-green text-deep-space-blue-100",
                !isSelected && isSameValue && "bg-deep-space-blue-500",

                // Grid Borders
                "border-r border-b border-deep-space-blue-500",
                subgridBorders.right && "border-r-2 border-r-deep-space-blue-600",
                subgridBorders.bottom && "border-b-2 border-b-deep-space-blue-600",

                // Error state
                cell.value && cell.value !== cell.solution && "text-red-400 bg-red-900/20"
            )}
        >
            {/* Cage Borders Overlay */}
            <div className={twMerge(
                "absolute inset-0 pointer-events-none z-10",
                borders.top && "border-t-2 border-t-amber-flame/50 border-dashed",
                borders.right && "border-r-2 border-r-amber-flame/50 border-dashed",
                borders.bottom && "border-b-2 border-b-amber-flame/50 border-dashed",
                borders.left && "border-l-2 border-l-amber-flame/50 border-dashed",
            )} />

            {cageSum && (
                <span className="absolute top-0.5 left-0.5 text-[10px] leading-none text-amber-flame font-normal z-20">
                    {cageSum}
                </span>
            )}

            {cell.value ? (
                <span className="z-0">{cell.value}</span>
            ) : (
                <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <div key={n} className="flex items-center justify-center">
                            {cell.notes.includes(n) && (
                                <span className="text-[8px] leading-none text-sky-blue-light-400">{n}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
