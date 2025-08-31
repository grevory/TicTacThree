import type { Player, GameHistory, GameState } from '../types/game';

export const useGameDisplay = (
  currentPlayer: Player,
  gameHistory: GameHistory,
  winner: Player | null,
  gameState: GameState
) => {
  const getNextMovePosition = (player: Player): number | null => {
    if (gameHistory[player].length === 3 && gameState === 'playing') {
      return gameHistory[player][0]?.position ?? null;
    }
    return null;
  };

  const getMustMoveInfo = () => {
    const mustMove = gameHistory[currentPlayer].length === 3 && gameState === 'playing';
    const highlightedSquare = mustMove ? gameHistory[currentPlayer][0]?.position ?? null : null;

    return { mustMove, highlightedSquare };
  };

  const getCurrentPlayerCount = (): number => {
    return gameHistory[currentPlayer].length;
  };

  const getGameStatus = (): string => {
    if (winner) {
      return `🎉 Player ${winner} wins!`;
    }
    if (gameState === 'draw') {
      return "🤝 It's a draw!";
    }

    const { mustMove, highlightedSquare } = getMustMoveInfo();
    if (mustMove) {
      return highlightedSquare !== null
        ? `Player ${currentPlayer} must move their piece from position ${highlightedSquare + 1}`
        : `Player ${currentPlayer} must move a piece`;
    }

    return `Player ${currentPlayer}'s turn (${getCurrentPlayerCount()}/3 pieces placed)`;
  };

  return {
    getNextMovePosition,
    getMustMoveInfo,
    getCurrentPlayerCount,
    getGameStatus,
  };
};