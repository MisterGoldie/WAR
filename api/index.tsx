import { Button, Frog } from 'frog'
import { neynar } from 'frog/middlewares'
import { initializeGame, type Card, type LocalState as GameState } from './gameLogic'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!

// Define background image URL
const BACKGROUND_URL = 'https://bafybeic3qu53tn46qmtgvterldnbbavt2h5y2x7unpyyc7txh2kcx6f6jm.ipfs.w3s.link/Frame%2039%20(3).png'

// Initialize the Frog app
export const app = new Frog({
  basePath: '/api',
  imageOptions: {
    width: 1080,
    height: 1080,
    fonts: [
      {
        name: 'Gloria Hallelujah',
        source: 'google',
        weight: 400,
      },
    ],
  }
}).use(
  neynar({
    apiKey: NEYNAR_API_KEY,
    features: ['interactor', 'cast'],
  })
)

// Function to create game UI
function createGameUI(state: GameState) {
  const { playerDeck, computerDeck, playerCard, computerCard, message, isWar } = state
  
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: `url(${BACKGROUND_URL})`,
        backgroundSize: 'cover',
        width: '1080px',
        height: '1080px',
        padding: '40px',
      },
      children: [
        {
          type: 'h1',
          props: {
            style: { fontSize: '40px', marginBottom: '20px' },
            children: 'War Card Game'
          }
        },
        {
          type: 'div',
          props: {
            style: { fontSize: '24px', marginBottom: '20px' },
            children: `Player Cards: ${playerDeck.length} | Computer Cards: ${computerDeck.length}`
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
              marginBottom: '20px'
            },
            children: [
              playerCard && {
                type: 'div',
                props: {
                  style: { textAlign: 'center' },
                  children: [
                    {
                      type: 'h3',
                      props: { children: 'Your Card' }
                    },
                    {
                      type: 'img',
                      props: {
                        src: `/assets/cards/${playerCard.filename}`,
                        alt: playerCard.label,
                        style: { width: '200px', height: '280px' }
                      }
                    }
                  ]
                }
              },
              computerCard && {
                type: 'div',
                props: {
                  style: { textAlign: 'center' },
                  children: [
                    {
                      type: 'h3',
                      props: { children: "Computer's Card" }
                    },
                    {
                      type: 'img',
                      props: {
                        src: `/assets/cards/${computerCard.filename}`,
                        alt: computerCard.label,
                        style: { width: '200px', height: '280px' }
                      }
                    }
                  ]
                }
              }
            ].filter(Boolean)
          }
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '28px',
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '10px',
              margin: '20px'
            },
            children: isWar ? "⚔️ WAR! ⚔️" : message
          }
        }
      ]
    }
  }
}

// Global game state
let gameState: GameState = initializeGame()

// Main game frame
app.frame('/', (c) => {
  return {
    image: createGameUI(gameState),
    intents: [{
      type: 'button',
      props: { 
        action: '/game',
        children: 'Start Game'
      }
    }]
  }
})

// Game route
app.frame('/game', (c) => {
  return {
    image: createGameUI(gameState),
    intents: [
      {
        type: 'button',
        props: { 
          action: '/draw_card',
          children: 'Draw Card'
        }
      },
      {
        type: 'button',
        props: { 
          action: '/reset_game',
          children: 'Reset Game'
        }
      }
    ]
  }
})

// Draw card route
app.frame('/draw_card', (c) => {
  console.log('Drawing card')
  try {
    const { playerDeck, computerDeck } = gameState
    console.log('Deck sizes - Player:', playerDeck.length, 'Computer:', computerDeck.length)
    
    if (!playerDeck.length || !computerDeck.length) {
      gameState.message = `Game Over! ${playerDeck.length ? 'Player' : 'Computer'} Wins!`
      return {
        image: createGameUI(gameState),
        intents: [{
          type: 'button',
          props: { 
            action: '/game',
            children: 'New Game'
          }
        }]
      }
    }

    const playerCard = playerDeck.shift()!
    const computerCard = computerDeck.shift()!
    
    gameState.playerCard = playerCard
    gameState.computerCard = computerCard
    
    if (playerCard.value === computerCard.value) {
      gameState.isWar = true
      gameState.gameStatus = 'war'
      gameState.warPile = [playerCard, computerCard]
      gameState.message = "It's a tie! War begins!"
    } else {
      const winner = playerCard.value > computerCard.value ? 'player' : 'computer'
      if (winner === 'player') {
        playerDeck.push(playerCard, computerCard)
        gameState.message = `You win with ${playerCard.label}!`
      } else {
        computerDeck.push(playerCard, computerCard)
        gameState.message = `Computer wins with ${computerCard.label}!`
      }
      gameState.gameStatus = 'playing'
    }
    return {
      image: createGameUI(gameState),
      intents: [
        {
          type: 'button',
          props: { 
            action: '/draw_card',
            children: 'Draw Card'
          }
        },
        {
          type: 'button',
          props: { 
            action: '/reset_game',
            children: 'Reset Game'
          }
        }
      ]
    }
  } catch (error) {
    console.error('Draw card error:', error)
    return {
      image: <div style={{padding: '20px'}}>Error drawing card. Please try again.</div>,
      intents: [{
        type: 'button',
        props: { 
          action: '/game',
          children: 'New Game'
        }
      }]
    }
  }
})

// War continuation action
app.frame('/continue_war', (c) => {
  console.log('Continuing war')
  try {
    const { playerDeck, computerDeck, warPile } = gameState
    console.log('War pile size:', warPile.length)
    
    if (playerDeck.length < 4 || computerDeck.length < 4) {
      gameState.message = `${playerDeck.length > computerDeck.length ? 'Player' : 'Computer'} wins the war by default!`
      gameState.gameStatus = 'ended'
      return {
        image: createGameUI(gameState),
        intents: [{
          type: 'button',
          props: { 
            action: '/game',
            children: 'New Game'
          }
        }]
      }
    }

    // Draw war cards
    for (let i = 0; i < 3; i++) {
      warPile.push(playerDeck.shift()!, computerDeck.shift()!)
    }
    
    const playerCard = playerDeck.shift()!
    const computerCard = computerDeck.shift()!
    warPile.push(playerCard, computerCard)
    
    gameState.playerCard = playerCard
    gameState.computerCard = computerCard
    
    if (playerCard.value === computerCard.value) {
      gameState.message = "Another tie! The war continues!"
    } else {
      const winner = playerCard.value > computerCard.value ? 'player' : 'computer'
      if (winner === 'player') {
        playerDeck.push(...warPile)
        gameState.message = `You win the war with ${playerCard.label}!`
      } else {
        computerDeck.push(...warPile)
        gameState.message = `Computer wins the war with ${computerCard.label}!`
      }
      gameState.warPile = []
      gameState.isWar = false
      gameState.gameStatus = 'playing'
    }
    return {
      image: createGameUI(gameState),
      intents: [{
        type: 'button',
        props: { 
          action: '/game',
          children: 'New Game'
        }
      }]
    }
  } catch (error) {
    console.error('War continuation error:', error)
    return {
      image: <div style={{padding: '20px'}}>Error during war. Please try again.</div>,
      intents: [{
        type: 'button',
        props: { 
          action: '/game',
          children: 'New Game'
        }
      }]
    }
  }
})

// Reset game route
app.frame('/reset_game', (c) => {
  console.log('Resetting game')
  try {
    gameState = initializeGame()
    console.log('Game state reset')
    return {
      image: createGameUI(gameState),
      intents: [
        {
          type: 'button',
          props: { 
            action: '/draw_card',
            children: 'Draw Card'
          }
        },
        {
          type: 'button',
          props: { 
            action: '/reset_game',
            children: 'Reset Game'
          }
        }
      ]
    }
  } catch (error) {
    console.error('Reset game error:', error)
    return {
      image: <div style={{padding: '20px'}}>Error resetting game. Please try again.</div>,
      intents: [
        {
          type: 'button',
          props: { 
            action: '/draw_card',
            children: 'Draw Card'
          }
        },
        {
          type: 'button',
          props: { 
            action: '/reset_game',
            children: 'Reset Game'
          }
        }
      ]
    }
  }
})

// View rules action
app.frame('/view_rules', (c) => {
  console.log('Viewing rules')
  try {
    gameState.message = 'Each player draws a card. Higher card wins! If cards match, WAR begins!'
    return {
      image: createGameUI(gameState),
      intents: [{
        type: 'button',
        props: { 
          action: '/game',
          children: 'New Game'
        }
      }]
    }
  } catch (error) {
    console.error('View rules error:', error)
    return {
      image: <div style={{padding: '20px'}}>Error loading rules. Please try again.</div>,
      intents: [{
        type: 'button',
        props: { 
          action: '/game',
          children: 'New Game'
        }
      }]
    }
  }
})

export default function handler(req: Request) {
  console.log('Handling request:', req.url)
  try {
    return app.fetch(req)
  } catch (error) {
    console.error('Handler error:', error)
    throw error // Re-throw to maintain error handling chain
  }
}