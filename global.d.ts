declare module 'frog' {
  export interface Context {
    res: (options: { 
      title?: string,
      image: {
        type: string,
        props: {
          style?: Record<string, string | number>,
          children: any
        }
      }, 
      intents: Array<{
        id: string,
        action: string,
        label: string
      }>
    }) => void
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