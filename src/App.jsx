import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const shuffleCards = (cards) => {
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const createCards = () => {
    const symbols = ["🍎", "🍌", "🐶", "🐱", "🍕", "⚽"];

    const cards = [...symbols, ...symbols];

    const shuffledCards = shuffleCards(cards);

    return shuffledCards.map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false,
    }));
  };

  const [gameCards, setGameCards] = useState(createCards());

  const [flippedCards, setFlippedCards] = useState([]);

  const [moves, setMoves] = useState(0);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2) {
      return;
    }

    const clickedCard = gameCards.find(
      (card) => card.id === id
    );

    if (clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    setGameCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? { ...card, isFlipped: true }
          : card
      )
    );

    setFlippedCards((prev) => [...prev, id]);

    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (flippedCards.length !== 2) {
      return;
    }

    const firstCard = gameCards.find(
      (card) => card.id === flippedCards[0]
    );

    const secondCard = gameCards.find(
      (card) => card.id === flippedCards[1]
    );

    if (firstCard.symbol === secondCard.symbol) {
      console.log("MATCH!");

      setGameCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstCard.id ||
          card.id === secondCard.id
            ? {
                ...card,
                isMatched: true,
              }
            : card
        )
      );

      setFlippedCards([]);
    } else {
      console.log("NOT MATCH!");

      setTimeout(() => {
        setGameCards((prevCards) =>
          prevCards.map((card) =>
            card.id === flippedCards[0] ||
            card.id === flippedCards[1]
              ? {
                  ...card,
                  isFlipped: false,
                }
              : card
          )
        );

        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, gameCards]);

  const allMatched = gameCards.every(
    (card) => card.isMatched
  );

  const restartGame = () => {
    setGameCards(createCards());
    setFlippedCards([]);
    setMoves(0);
  };

  return (
    <div className="game">
      <h1>Memory Game</h1>

      <div className="bar">
        <span>Moves: {moves}</span>
        <button onClick={restartGame}>Restart</button>
      </div>

      {allMatched && <h2 className="win">You Won! 🎉</h2>}

      <div className="board">
        {gameCards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? "flipped" : ""} ${
              card.isMatched ? "matched" : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="inner">
              <div className="face back">?</div>
              <div className="face front">{card.symbol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;