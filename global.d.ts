/// <reference types="frog/jsx" />

declare module 'frog' {
  import { FC } from 'react'
  import { JSX } from 'frog/jsx'
  
  export interface Context {
    res: (options: { 
      image: JSX.Element, 
      intents: JSX.Element[] 
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
    children: string | JSX.Element
  }

  export const Button: (props: ButtonProps) => JSX.Element
  
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
    fetch(request: Request) {
      throw new Error('Method not implemented.')
    }
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