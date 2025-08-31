export type Player = 'X' | 'O';
export type Board = (Player | null)[];
export type Move = {
  position: number;
  timestamp: number;
};
export type GameHistory = Record<Player, Move[]>;
export type GameState = 'playing' | 'won' | 'draw';