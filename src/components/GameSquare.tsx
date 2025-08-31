import React from 'react';
import type { Player } from '../types/game';

interface GameSquareProps {
  index: number;
  value: Player | null;
  isHighlighted: boolean;
  isNextMoveX: boolean;
  isNextMoveO: boolean;
  mustMove: boolean;
  onClick: (index: number) => void;
}

export const GameSquare: React.FC<GameSquareProps> = ({
  index,
  value,
  isHighlighted,
  isNextMoveX,
  isNextMoveO,
  mustMove,
  onClick,
}) => {
  const getSquareStyle = (): string => {
    const baseStyle = "w-20 h-20 sm:w-24 sm:h-24 border-4 border-purple-600 flex items-center justify-center text-4xl sm:text-5xl font-bold cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative";

    // Active move highlight (current player must move this piece)
    if (isHighlighted) {
      return `${baseStyle} bg-yellow-300 animate-pulse shadow-lg ring-4 ring-yellow-400`;
    }

    // Next move glow for both teams
    if (isNextMoveX) {
      return `${baseStyle} bg-white hover:bg-purple-50 shadow-md ring-2 ring-emerald-400 shadow-emerald-400/50`;
    }

    if (isNextMoveO) {
      return `${baseStyle} bg-white hover:bg-purple-50 shadow-md ring-2 ring-pink-400 shadow-pink-400/50`;
    }

    return `${baseStyle} bg-white hover:bg-purple-50 shadow-md`;
  };

  const getPlayerStyle = (player: Player | null): string => {
    if (player === 'X') {
      return "text-emerald-500 drop-shadow-lg";
    } else if (player === 'O') {
      return "text-pink-500 drop-shadow-lg";
    }
    return "";
  };

  return (
    <div
      className={getSquareStyle()}
      onClick={() => onClick(index)}
    >
      <span className={getPlayerStyle(value)}>
        {value}
      </span>

      {/* Active move indicator */}
      {isHighlighted && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          !
        </div>
      )}

      {/* Next move indicators */}
      {isNextMoveX && !mustMove && (
        <div className="absolute -top-1 -left-1 bg-emerald-400 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          1
        </div>
      )}
      {isNextMoveO && !mustMove && (
        <div className="absolute -top-1 -left-1 bg-pink-400 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          1
        </div>
      )}
    </div>
  );
};