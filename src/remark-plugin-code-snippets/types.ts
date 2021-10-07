export interface Options {
  basePath?: string;
  trim?: boolean | 'leading' | 'trailing';
  normalizeIndent?: boolean;
}

export interface TransformNodeOptions extends Required<Pick<Options, 'basePath'>> {
  trim: (text: string) => string;
} 
