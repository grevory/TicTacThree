import React, { useState, useCallback } from 'react';

const TicTacThree = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameHistory, setGameHistory] = useState({ X: [], O: [] });
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [mustMove, setMustMove] = useState(false);
  const [highlightedSquare, setHighlightedSquare] = useState(null);

  const checkWinner = useCallback((newBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  }, []);

  const checkDraw = useCallback((newBoard) => {
    return newBoard.every(square => square !== null) && !checkWinner(newBoard);
  }, [checkWinner]);

  const handleSquareClick = useCallback((index) => {
    if (winner || isDraw) return;

    const newBoard = [...board];
    const history = { ...gameHistory };

    if (mustMove) {
      // Player must move their oldest piece
      if (newBoard[index] !== null) return; // Can't move to occupied square

      const oldestMove = history[currentPlayer][0];
      if (oldestMove === undefined) return;

      // Remove from old position
      newBoard[oldestMove.position] = null;
      // Place in new position
      newBoard[index] = currentPlayer;

      // Update history - remove oldest and add new move
      history[currentPlayer] = [
        ...history[currentPlayer].slice(1),
        { position: index, timestamp: Date.now() }
      ];

      setMustMove(false);
      setHighlightedSquare(null);
    } else {
      // Normal placement
      if (newBoard[index] !== null) return; // Square already occupied

      newBoard[index] = currentPlayer;
      history[currentPlayer].push({ position: index, timestamp: Date.now() });
    }

    // Check for win condition
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setBoard(newBoard);
      setGameHistory(history);
      return;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true);
      setBoard(newBoard);
      setGameHistory(history);
      return;
    }

    setBoard(newBoard);
    setGameHistory(history);

    // Switch players
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Check if next player needs to move a piece (has 3 pieces on board)
    if (history[nextPlayer].length === 3) {
      setMustMove(true);
      setHighlightedSquare(history[nextPlayer][0].position);
    }

    setCurrentPlayer(nextPlayer);
  }, [board, currentPlayer, gameHistory, winner, isDraw, mustMove, checkWinner, checkDraw]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameHistory({ X: [], O: [] });
    setWinner(null);
    setIsDraw(false);
    setMustMove(false);
    setHighlightedSquare(null);
  };

  const getNextMovePosition = (player) => {
    if (gameHistory[player].length === 3 && !winner && !isDraw) {
      return gameHistory[player][0]?.position ?? null;
    }
    return null;
  };

  const getSquareStyle = (index) => {
    const baseStyle = "w-20 h-20 sm:w-24 sm:h-24 border-4 border-purple-600 flex items-center justify-center text-4xl sm:text-5xl font-bold cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative";

    // Active move highlight (current player must move this piece)
    if (highlightedSquare === index) {
      return `${baseStyle} bg-yellow-300 animate-pulse shadow-lg ring-4 ring-yellow-400`;
    }

    // Next move glow for both teams
    const xNextMove = getNextMovePosition('X');
    const oNextMove = getNextMovePosition('O');
    
    if (xNextMove === index) {
      return `${baseStyle} bg-white hover:bg-purple-50 shadow-md ring-2 ring-emerald-400 shadow-emerald-400/50`;
    }
    
    if (oNextMove === index) {
      return `${baseStyle} bg-white hover:bg-purple-50 shadow-md ring-2 ring-pink-400 shadow-pink-400/50`;
    }

    return `${baseStyle} bg-white hover:bg-purple-50 shadow-md`;
  };

  const getPlayerStyle = (player) => {
    if (player === 'X') {
      return "text-emerald-500 drop-shadow-lg";
    } else if (player === 'O') {
      return "text-pink-500 drop-shadow-lg";
    }
    return "";
  };

  const getCurrentPlayerCount = () => {
    return gameHistory[currentPlayer].length;
  };

  const getGameStatus = () => {
    if (winner) {
      return `🎉 Player ${winner} wins!`;
    }
    if (isDraw) {
      return "🤝 It's a draw!";
    }
    if (mustMove) {
      const oldestPosition = highlightedSquare;
      return oldestPosition !== null
        ? `Player ${currentPlayer} must move their piece from position ${oldestPosition + 1}`
        : `Player ${currentPlayer} must move a piece`;
    }
    return `Player ${currentPlayer}'s turn (${getCurrentPlayerCount()}/3 pieces placed)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Tic Tac Three
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Each player can only have 3 pieces. When all 3 are placed, you must move your oldest piece!
          </p>
          <div className="text-lg font-semibold text-gray-800">
            {getGameStatus()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 mx-auto w-fit">
          {board.map((square, index) => (
            <div
              key={index}
              className={getSquareStyle(index)}
              onClick={() => handleSquareClick(index)}
            >
              <span className={getPlayerStyle(square)}>
                {square}
              </span>
              {highlightedSquare === index && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  !
                </div>
              )}
              {/* Next move indicators */}
              {getNextMovePosition('X') === index && !mustMove && (
                <div className="absolute -top-1 -left-1 bg-emerald-400 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </div>
              )}
              {getNextMovePosition('O') === index && !mustMove && (
                <div className="absolute -top-1 -left-1 bg-pink-400 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <div className="text-emerald-500 font-bold text-xl mb-1 flex items-center justify-center gap-2">
              Player X
              {mustMove && currentPlayer === 'X' && (
                <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  !
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {gameHistory.X.length}/3 pieces
            </div>
            {getNextMovePosition('X') !== null && !winner && !isDraw && (
              <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Next to move: #{getNextMovePosition('X') + 1}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-pink-500 font-bold text-xl mb-1 flex items-center justify-center gap-2">
              Player O
              {mustMove && currentPlayer === 'O' && (
                <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  !
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {gameHistory.O.length}/3 pieces
            </div>
            {getNextMovePosition('O') !== null && !winner && !isDraw && (
              <div className="text-xs text-pink-600 font-medium mt-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                Next to move: #{getNextMovePosition('O') + 1}
              </div>
            )}
          </div>
        </div>

        {mustMove && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div className="text-yellow-800 font-medium">
              🔄 Move Required!
            </div>
            <div className="text-yellow-700 text-sm">
              Click on an empty square to move your highlighted piece there.
            </div>
          </div>
        )}

        <button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          🎮 New Game
        </button>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p className="mb-1">💡 Strategy Tip: Plan which piece you'll need to move next!</p>
          <p>Watch your opponent's oldest pieces to predict their moves.</p>
          <p className="mt-2 text-emerald-600">🟢 Emerald glow = X's next move</p>
          <p className="text-pink-600">🔴 Pink glow = O's next move</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacThree;