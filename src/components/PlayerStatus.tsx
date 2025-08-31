import React from 'react';
import type { Player } from '../types/game';

interface PlayerStatusProps {
    player: Player;
    pieceCount: number;
    nextMovePosition: number | null;
    mustMove: boolean;
    isCurrentPlayer: boolean;
    winner: Player | null;
    gameState: 'playing' | 'won' | 'draw';
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({
    player,
    pieceCount,
    nextMovePosition,
    mustMove,
    isCurrentPlayer,
    winner,
    gameState,
}) => {
    const playerColor = player === 'X' ? 'emerald' : 'pink';
    const colorClasses = {
        emerald: {
            text: 'text-emerald-500',
            nextMove: 'text-emerald-600',
            dot: 'bg-emerald-400',
        },
        pink: {
            text: 'text-pink-500',
            nextMove: 'text-pink-600',
            dot: 'bg-pink-400',
        },
    };

    return (
        <div className="text-center">
            <div className={`${colorClasses[playerColor].text} font-bold text-xl mb-1 flex items-center justify-center gap-2`}>
                Player {player}
                {mustMove && isCurrentPlayer && (
                    <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                        !
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-600">
                {pieceCount}/3 pieces
            </div>

            {nextMovePosition !== null && !winner && gameState === 'playing' && (
                <div className={`text-xs ${colorClasses[playerColor].nextMove} font-medium mt-1 flex items-center justify-center gap-1`}>
                    <span className={`w-2 h-2 ${colorClasses[playerColor].dot} rounded-full animate-pulse`}></span>
                    Next to move: #{nextMovePosition + 1}
                </div>
            )}
        </div>
    );
};