# Tic Tac Three

A strategic variation of tic-tac-toe where each player can only have 3 pieces on the board, and must move their oldest piece when placing new ones.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/grevory/TicTacThree.git
cd tic-tac-three

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
tic-tac-three/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── TicTacThree.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🎮 Game Rules

1. Players alternate placing X and O pieces
2. Each player can only have 3 pieces on the board at once
3. Once a player has 3 pieces, they must move their oldest piece instead of placing new ones
4. The piece that must be moved is highlighted with visual indicators
5. Win by getting 3 in a row (horizontal, vertical, or diagonal)

## 🛠 Technologies Used

-   React 18
-   Tailwind CSS
-   GitHub Pages deployment
