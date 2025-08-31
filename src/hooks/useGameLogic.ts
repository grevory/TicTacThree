import { useState, useCallback } from 'react';
import type { Player, Board, GameHistory, GameState } from '../types/game';

export const useGameLogic = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameHistory, setGameHistory] = useState<GameHistory>({ X: [], O: [] });
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');

  const checkWinner = useCallback((newBoard: Board): Player | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a] as Player;
      }
    }
    return null;
  }, []);

  const checkDraw = useCallback((newBoard: Board): boolean => {
    return newBoard.every(square => square !== null) && !checkWinner(newBoard);
  }, [checkWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameHistory({ X: [], O: [] });
    setWinner(null);
    setGameState('playing');
  }, []);

  const makeMove = useCallback((index: number): boolean => {
    if (gameState !== 'playing') return false;

    const newBoard = [...board];
    const history = { ...gameHistory };

    // Check if it's a forced move (player has 3 pieces)
    const mustMove = history[currentPlayer].length === 3;

    if (mustMove) {
      // Player must move their oldest piece
      if (newBoard[index] !== null) return false; // Can't move to occupied square

      const oldestMove = history[currentPlayer][0];
      if (!oldestMove) return false;

      // Remove from old position and place in new position
      newBoard[oldestMove.position] = null;
      newBoard[index] = currentPlayer;

      // Update history - remove oldest and add new move
      history[currentPlayer] = [
        ...history[currentPlayer].slice(1),
        { position: index, timestamp: Date.now() }
      ];
    } else {
      // Normal placement
      if (newBoard[index] !== null) return false; // Square already occupied

      newBoard[index] = currentPlayer;
      history[currentPlayer].push({ position: index, timestamp: Date.now() });
    }

    // Check for win condition
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('won');
      setBoard(newBoard);
      setGameHistory(history);
      return true;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setGameState('draw');
      setBoard(newBoard);
      setGameHistory(history);
      return true;
    }

    // Update game state and switch players
    setBoard(newBoard);
    setGameHistory(history);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    return true;
  }, [board, currentPlayer, gameHistory, gameState, checkWinner, checkDraw]);

  return {
    board,
    currentPlayer,
    gameHistory,
    winner,
    gameState,
    makeMove,
    resetGame,
  };
};