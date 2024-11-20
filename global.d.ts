/// <reference types="frog/jsx" />

declare module 'frog' {
  import { JSX } from 'frog/jsx'
  
  export interface Context {
    res: (options: { 
      image: JSX.Element;
      intents: JSX.Element[];
    }) => void;
    frameData?: {
      fid?: number;
    };
    buttonValue?: string;
    status?: string;
  }

  export interface FrogOptions {
    basePath?: string;
    imageOptions?: {
      width: number;
      height: number;
    };
    imageAspectRatio?: string;
    title?: string;
  }

  export const Button: {
    (props: { action?: string; value?: string; children: string | JSX.Element }): JSX.Element;
    Link: (props: { href: string; children: string | JSX.Element }) => JSX.Element;
  };

  export class Frog<T = any> {
    constructor(options: FrogOptions);
    frame: (path: string, handler: (context: Context) => void) => void;
    use: (middleware: any) => this;
  }
}

declare module 'frog/middlewares' {
  export interface NeynarVariables {
    interactor: {
      fid: number;
    };
  }

  export function neynar(options: {
    apiKey: string;
    features: string[];
  }): any;
}

declare module 'frog/vercel' {
  import type { Frog } from 'frog';
  export function handle(app: Frog): {
    GET: (req: Request) => Promise<Response>;
    POST: (req: Request) => Promise<Response>;
  };
}

declare module 'frog/edge' {
  import type { Frog } from 'frog';
  export function createEdgeHandler(app: Frog): {
    GET: (req: Request) => Promise<Response>;
    POST: (req: Request) => Promise<Response>;
  };
}

declare module 'frog/frames' {
  import type { Frog } from 'frog';
  export function createFrames(app: Frog): {
    GET: (req: Request) => Promise<Response>;
    POST: (req: Request) => Promise<Response>;
  };
}