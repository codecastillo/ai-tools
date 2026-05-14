export interface ContextFit {
  tokens: number;
  label: string;
  what_fits: string;
  example?: string;
}

export const CONTEXT_FITS: ContextFit[] = [
  { tokens: 8_000,     label: '8K',  what_fits: 'A long email',                    example: '~6K words' },
  { tokens: 32_000,    label: '32K', what_fits: 'A short paper',                   example: '~25K words' },
  { tokens: 128_000,   label: '128K',what_fits: 'A novel chapter',                 example: '~96K words' },
  { tokens: 200_000,   label: '200K',what_fits: 'A medium novel',                  example: '~150K words, 600 pages' },
  { tokens: 400_000,   label: '400K',what_fits: 'A research paper bundle',         example: '~300K words' },
  { tokens: 1_000_000, label: '1M',  what_fits: 'An entire codebase',              example: 'Linux kernel sources' },
  { tokens: 2_000_000, label: '2M',  what_fits: 'A small library of books',       example: '20 short novels combined' },
];

export function findFit(tokens: number): ContextFit {
  let best = CONTEXT_FITS[0];
  for (const f of CONTEXT_FITS) {
    if (f.tokens <= tokens) best = f;
  }
  return best;
}
