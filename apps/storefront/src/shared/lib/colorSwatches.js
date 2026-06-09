const COLOR_MAP = {
  red: '#ef4444',
  crimson: '#dc143c',
  rose: '#fb7185',
  pink: '#ec4899',
  fuchsia: '#d946ef',
  magenta: '#c026d3',
  purple: '#8b5cf6',
  violet: '#7c3aed',
  indigo: '#4f46e5',
  blue: '#3b82f6',
  navy: '#1e3a5f',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  turquoise: '#2dd4bf',
  green: '#22c55e',
  emerald: '#10b981',
  lime: '#84cc16',
  olive: '#708238',
  yellow: '#facc15',
  amber: '#f59e0b',
  orange: '#f97316',
  coral: '#fb7185',
  peach: '#fed7aa',
  brown: '#92400e',
  chocolate: '#7c2d12',
  tan: '#d2b48c',
  camel: '#c19a6b',
  beige: '#e7d8bd',
  cream: '#fffdd0',
  ivory: '#fffff0',
  white: '#f8fafc',
  black: '#111827',
  gray: '#6b7280',
  grey: '#6b7280',
  slate: '#475569',
  charcoal: '#374151',
  graphite: '#374151',
  silver: '#cbd5e1',
  gold: '#f59e0b',
  bronze: '#b45309',
  burgundy: '#800020',
  maroon: '#7f1d1d',
  mint: '#98ff98',
  sage: '#9caf88',
  pastel: '#f9a8d4',
  vivid: '#f97316',
  lavender: '#c4b5fd',
  lilac: '#d8b4fe',
  sky: '#38bdf8',
  clear: '#e0f2fe',
  smoke: '#64748b',
  natural: '#d6b88d',
  walnut: '#7c4a2d',
  oak: '#c8a46b',
  primary: '#2563eb',
  college: '#0f766e',
  assorted: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 25%, #22c55e 50%, #3b82f6 75%, #8b5cf6 100%)',
  rainbow: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 20%, #facc15 40%, #22c55e 60%, #3b82f6 80%, #8b5cf6 100%)',
};

const COLOR_ALIASES = {
  'light blue': 'sky',
  'dark blue': 'navy',
  'light green': 'mint',
  'dark green': 'emerald',
  'hot pink': 'pink',
  'rose gold': 'gold',
  transparent: 'clear',
  mixed: 'assorted',
  multi: 'assorted',
  multicolor: 'assorted',
  colourful: 'assorted',
  colorful: 'assorted',
  do: 'red',
  đỏ: 'red',
  hong: 'pink',
  hồng: 'pink',
  xanh: 'green',
  'xanh la': 'green',
  'xanh lá': 'green',
  'xanh duong': 'blue',
  'xanh dương': 'blue',
  vang: 'yellow',
  vàng: 'yellow',
  cam: 'orange',
  den: 'black',
  đen: 'black',
  trang: 'white',
  trắng: 'white',
  xam: 'gray',
  xám: 'gray',
  nau: 'brown',
  nâu: 'brown',
  bac: 'silver',
  bạc: 'silver',
};

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const isColorAttribute = (key = '') => {
  const normalized = String(key).trim().toLowerCase();
  return ['color', 'colour', 'mau', 'màu'].includes(normalized);
};

export const getColorSwatch = (colorName) => {
  if (!colorName) return null;
  const normalized = String(colorName).trim().toLowerCase();
  if (HEX_COLOR_PATTERN.test(normalized)) return normalized;
  const key = COLOR_ALIASES[normalized] || normalized;
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  if (typeof CSS !== 'undefined' && CSS.supports?.('color', normalized)) {
    return normalized;
  }
  return null;
};
