import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameDisplay } from '../hooks/useGameDisplay';
import { GameSquare } from './GameSquare';
import { PlayerStatus } from './PlayerStatus';

const TicTacThree = () => {
  const {
    board,
    currentPlayer,
    gameHistory,
    winner,
    gameState,
    makeMove,
    resetGame,
  } = useGameLogic();

  const {
    getNextMovePosition,
    getMustMoveInfo,
    getGameStatus,
  } = useGameDisplay(currentPlayer, gameHistory, winner, gameState);

  const { mustMove, highlightedSquare } = getMustMoveInfo();

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
            <GameSquare
              key={index}
              index={index}
              value={square}
              isHighlighted={highlightedSquare === index}
              isNextMoveX={getNextMovePosition('X') === index}
              isNextMoveO={getNextMovePosition('O') === index}
              mustMove={mustMove}
              onClick={makeMove}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <PlayerStatus
            player="X"
            pieceCount={gameHistory.X.length}
            nextMovePosition={getNextMovePosition('X')}
            mustMove={mustMove}
            isCurrentPlayer={currentPlayer === 'X'}
            winner={winner}
            gameState={gameState}
          />
          <PlayerStatus
            player="O"
            pieceCount={gameHistory.O.length}
            nextMovePosition={getNextMovePosition('O')}
            mustMove={mustMove}
            isCurrentPlayer={currentPlayer === 'O'}
            winner={winner}
            gameState={gameState}
          />
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