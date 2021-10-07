import { Node } from 'unist';

export interface Options {
  basePath?: string;
  trim?: boolean | 'leading' | 'trailing';
  normalizeIndent?: boolean;
  extensions?: Record<string, string>;
}

export interface TransformNodeOptions extends Required<Pick<Options, 'basePath' | 'extensions'>> {
  trim: (text: string) => string;
} 

export interface MDASTNode extends Node {
  lang?: string;
  meta?: string;
  value: string;
  children?: MDASTNode[];
}