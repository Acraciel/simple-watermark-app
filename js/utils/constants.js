export const FONTS = {
  cursive: [
    { name: 'Great Vibes', family: "'Great Vibes', cursive" },
    { name: 'Playfair Display', family: "'Playfair Display', serif" },
    { name: 'Dancing Script', family: "'Dancing Script', cursive" },
    { name: 'Satisfy', family: "'Satisfy', cursive" },
    { name: 'Pacifico', family: "'Pacifico', cursive" }
  ],
  professional: [
    { name: 'Poppins', family: "'Poppins', sans-serif" },
    { name: 'Montserrat', family: "'Montserrat', sans-serif" },
    { name: 'Raleway', family: "'Raleway', sans-serif" },
    { name: 'Quicksand', family: "'Quicksand', sans-serif" },
    { name: 'Nunito', family: "'Nunito', sans-serif" }
  ],
  neutral: [
    { name: 'Roboto', family: "'Roboto', sans-serif" },
    { name: 'Inter', family: "'Inter', sans-serif" },
    { name: 'Open Sans', family: "'Open Sans', sans-serif" },
    { name: 'Source Sans Pro', family: "'Source Sans Pro', sans-serif" },
    { name: 'Work Sans', family: "'Work Sans', sans-serif" }
  ]
};

export const FONT_CATEGORIES = [
  { id: 'cursive', name: 'Cursiva elegante' },
  { id: 'professional', name: 'Limpias profesionales' },
  { id: 'neutral', name: 'Discretas y legibles' }
];

export const OPACITY_LEVELS = [
  { id: 'subtle', name: 'Sutil', value: 0.20 },
  { id: 'moderate', name: 'Moderado', value: 0.35 },
  { id: 'pronounced', name: 'Pronunciado', value: 0.50 }
];

export const WATERMARK_TYPES = [
  { id: 'signature', name: 'Firma' },
  { id: 'mosaic', name: 'Mosaico diagonal' }
];

export const POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

export const DEFAULTS = {
  watermarkText: 'Tu nombre',
  watermarkType: 'signature',
  fontSize: 24,
  fontCategory: 'cursive',
  fontFamily: "'Great Vibes', cursive",
  opacity: 0.35,
  position: 'bottom-right',
  textColor: '#ffffff'
};
