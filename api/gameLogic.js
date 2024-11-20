export function initializeGame() {
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
function createShuffledDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = Array.from({ length: 13 }, (_, i) => i + 1);
    const deck = suits.flatMap((suit) => values.map((value) => {
        const label = getCardLabel(value);
        return {
            value,
            suit,
            label: `${label} of ${suit}`,
            filename: `${value}_of_${suit}.png`
        };
    }));
    return shuffle(deck);
}
function getCardLabel(value) {
    const specialCards = {
        1: 'Ace',
        11: 'Jack',
        12: 'Queen',
        13: 'King'
    };
    return specialCards[value] || value.toString();
}
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    return newArray;
}
