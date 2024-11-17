/// <reference types="frog/jsx" />

declare module 'frog' {
  import { FC } from 'react'
  import { JSX } from 'frog/jsx'
  
  export interface Context {
    res: (options: { 
      image: JSX.Element, 
      intents: JSX.Element[] 
    }) => void
  }

  export interface ButtonProps {
    action: string
    children: string | JSX.Element
  }

  export const Button: FC<ButtonProps>
  
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
    constructor(options: FrogOptions)
    frame: (path: string, handler: (context: Context) => void) => void
    use: (middleware: any) => this
  }
}

declare module 'frog/vercel' {
  import { Frog } from 'frog'
  export const handle: (app: Frog) => any
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