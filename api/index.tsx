/** @jsxImportSource frog/jsx */
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

// Function to create game UI component
function GameUI({ state }: { state: GameState }): JSX.Element {
  const { playerDeck, computerDeck, playerCard, computerCard, message, isWar } = state
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: `url(${BACKGROUND_URL})`,
      backgroundSize: 'cover',
      width: '1080px',
      height: '1080px',
      padding: '40px',
    }}>
      <h1 style={{ fontSize: '40px', marginBottom: '20px' }}>War Card Game</h1>
      
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        Player Cards: {playerDeck.length} | Computer Cards: {computerDeck.length}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          {playerCard && (
            <>
              <h3>Your Card</h3>
              <img
                src={`/assets/cards/${playerCard.filename}`}
                alt={playerCard.label}
                style={{ width: '200px', height: '280px' }}
              />
            </>
          )}
        </div>
        
        <div style={{ textAlign: 'center' }}>
          {computerCard && (
            <>
              <h3>Computer's Card</h3>
              <img
                src={`/assets/cards/${computerCard.filename}`}
                alt={computerCard.label}
                style={{ width: '200px', height: '280px' }}
              />
            </>
          )}
        </div>
      </div>
      
      <div style={{
        fontSize: '28px',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: '10px',
        margin: '20px'
      }}>
        {isWar ? "⚔️ WAR! ⚔️" : message}
      </div>
    </div>
  )
}

// Global game state
let gameState: GameState = initializeGame()

// Main game frame with proper typing
app.frame('/', (c) => {
  const { gameStatus } = gameState
  
  const buttons = []
  if (gameStatus === 'initial' || gameStatus === 'playing') {
    buttons.push(<Button action="/draw_card">Draw Card</Button>)
  }
  if (gameStatus === 'war') {
    buttons.push(<Button action="/continue_war">Continue War</Button>)
  }
  buttons.push(<Button action="/reset_game">Reset Game</Button>)
  buttons.push(<Button action="/view_rules">Rules</Button>)
  return c.res({
    image: GameUI({ state: gameState }),
    intents: buttons,
    meta: {
      title: "War Card Game",
      description: "A classic card game of War"
    }
  })
})

// Draw card action
app.frame('/draw_card', (c) => {
  console.log('Drawing card')
  try {
    const { playerDeck, computerDeck } = gameState
    console.log('Deck sizes - Player:', playerDeck.length, 'Computer:', computerDeck.length)
    
    if (!playerDeck.length || !computerDeck.length) {
      gameState.message = `Game Over! ${playerDeck.length ? 'Player' : 'Computer'} Wins!`
      gameState.gameStatus = 'ended'
      return {
        title: "War Card Game",
        image: GameUI({ state: gameState }),
        intents: [<Button action="/">Return to Game</Button>],
        description: "A classic card game of War"
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
      title: "War Card Game",
      image: GameUI({ state: gameState }),
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
    }
  } catch (error) {
    console.error('Draw card error:', error)
    return {
      title: "War Card Game",
      image: <div style={{padding: '20px'}}>Error drawing card. Please try again.</div>,
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
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
        title: "War Card Game",
        image: GameUI({ state: gameState }),
        intents: [<Button action="/">Return to Game</Button>],
        description: "A classic card game of War"
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
      title: "War Card Game",
      image: GameUI({ state: gameState }),
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
    }
  } catch (error) {
    console.error('War continuation error:', error)
    return {
      title: "War Card Game",
      image: <div style={{padding: '20px'}}>Error during war. Please try again.</div>,
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
    }
  }
})

// Reset game action
app.frame('/reset_game', (c) => {
  console.log('Resetting game')
  try {
    gameState = initializeGame()
    console.log('Game state reset')
    return {
      title: "War Card Game",
      image: GameUI({ state: gameState }),
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
    }
  } catch (error) {
    console.error('Reset game error:', error)
    return {
      title: "War Card Game",
      image: <div style={{padding: '20px'}}>Error resetting game. Please try again.</div>,
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
    }
  }
})

// View rules action
app.frame('/view_rules', (c) => {
  console.log('Viewing rules')
  try {
    gameState.message = 'Each player draws a card. Higher card wins! If cards match, WAR begins!'
    return {
      title: "War Card Game",
      image: GameUI({ state: gameState }),
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
    }
  } catch (error) {
    console.error('View rules error:', error)
    return {
      title: "War Card Game",
      image: <div style={{padding: '20px'}}>Error loading rules. Please try again.</div>,
      intents: [<Button action="/">Return to Game</Button>],
      description: "A classic card game of War"
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