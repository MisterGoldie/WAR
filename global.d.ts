declare module 'frog' {
  export interface Context {
    res: (options: { 
      image: any, 
      intents: Array<{
        type: 'button',
        props: {
          action?: string
          href?: string
          children: string
        }
      }>,
      meta?: {
        title?: string
        description?: string
        image?: {
          src: string
          aspectRatio?: string
        }
        theme?: {
          accent?: string
        }
      }
    }) => void
  }

  export interface ButtonProps {
    action?: string
    href?: string
    children: string
  }

  export const Button: (props: ButtonProps) => {
    type: 'button'
    props: ButtonProps
  }
  
  export interface FrogOptions {
    basePath?: string
    imageOptions?: {
      width: number
      height: number
      fonts?: Array<{
        name: string
        source: string
        weight: number
      }>
    }
    title?: string
    initialState?: any
    hub?: {
      apiUrl: string
      fetchOptions: {
        headers: {
          [key: string]: string
        }
      }
    }
  }

  export class Frog {
    fetch(request: Request): Promise<Response>
    constructor(options: FrogOptions)
    frame: (path: string, handler: (context: Context) => void) => void
    use: (middleware: any) => this
  }

  export const serve: (app: Frog) => { GET: any; POST: any }
}

declare module 'frog/middlewares' {
  export interface NeynarVariables {
    interactor: {
      fid: number
    }
    cast?: {
      fid: number
      hash: string
    }
  }

  export function neynar(options: {
    apiKey: string
    features: string[]
  }): any
}

declare module 'frog/jsx' {
  export * from 'frog/jsx'
}

declare namespace JSX {
    interface IntrinsicElements {
      div: any;
      h1: any;
      h2: any;
      h3: any;
      p: any;
      img: any;
      button: any;
      span: any;
    }
  }

declare module 'frog/vercel' {
  import { Frog } from 'frog'
  export const handle: (app: Frog) => { GET: any; POST: any }
}

declare module 'frog/edge' {
  import { Frog } from 'frog'
  export const createEdgeHandler: (app: Frog) => { GET: any; POST: any }
}

declare module 'frog/frames' {
  import { Frog } from 'frog'
  export const createFrames: (app: Frog) => { GET: any; POST: any }
}

export interface Card {
    value: number;
    suit: string;
    label: string;
    filename: string;
}
  
export interface LocalState {
    playerDeck: Card[];
    computerDeck: Card[];
    playerCard: Card | null;
    computerCard: Card | null;
    warPile: Card[];
    message: string;
    gameStatus: 'initial' | 'playing' | 'war' | 'ended';
    isWar: boolean;
}

export function initializeGame(): LocalState {
    // ... rest of the function remains the same ...
}

function createShuffledDeck(): Card[] {
    // ... rest of the function remains the same ...
}

function getCardLabel(value: number): string {
    // ... rest of the function remains the same ...
}

function shuffle(array: Card[]): Card[] {
    // ... rest of the function remains the same ...
}