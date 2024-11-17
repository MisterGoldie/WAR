/// <reference types="frog/jsx" />

declare module 'frog' {
  export * from 'frog'
}

declare module 'frog/jsx' {
  export * from 'frog/jsx'
}

declare module 'frog/vercel' {
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
  }

  export class Frog {
    constructor(options: FrogOptions)
    frame: (path: string, handler: (context: Context) => void) => void
  }
  
  export const handle: (app: Frog) => any
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