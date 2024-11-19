interface Card {
    value: number;
    suit: string;
    label: string;
    filename: string;
  }
  
  interface LocalState {
    playerDeck: Card[];
    computerDeck: Card[];
    playerCard: Card | null;
    computerCard: Card | null;
    warPile: Card[];
    message: string;
    gameStatus: 'initial' | 'playing' | 'war' | 'ended';
    isWar: boolean;
  }
  
  function initializeGame(): LocalState {
    const deck = createShuffledDeck();
    const midpoint = Math.floor(deck.length / 2);
    return {
      playerDeck: deck.slice(0, midpoint),
      computerDeck: deck.slice(midpoint),
      playerCard: null,
      computerCard: null,
      warPile: [],
      message: 'Welcome to War! Draw a card to begin.',
      gameStatus: 'initial',
      isWar: false
    };
  }
  
  function createShuffledDeck(): Card[] {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = Array.from({ length: 13 }, (_, i) => i + 1);
    const deck = suits.flatMap((suit) =>
      values.map((value) => {
        const label = getCardLabel(value);
        return {
          value,
          suit,
          label: `${label} of ${suit}`,
          filename: `${value}_of_${suit}.png`
        };
      })
    );
    return shuffle(deck);
  }
  
  function getCardLabel(value: number): string {
    const specialCards: { [key: number]: string } = {
      1: 'Ace',
      11: 'Jack',
      12: 'Queen',
      13: 'King'
    };
    return specialCards[value] || value.toString();
  }
  
  function shuffle(array: Card[]): Card[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  export { initializeGame, createShuffledDeck, type Card, type LocalState };