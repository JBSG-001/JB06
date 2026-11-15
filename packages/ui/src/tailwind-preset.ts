export const jb06TailwindConfig = {
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        border: '#E8E8E4',
        'border-subtle': '#F0F0EC',
        text: {
          primary: '#111111',
          muted: '#6B6B6B',
          subtle: '#8E8E8A',
        },
        gold: {
          DEFAULT: '#B8912F',
          light: '#D4AF37',
          dark: '#967422',
          subtle: '#FAF6ED',
        },
        status: {
          success: '#10B981',
          'success-bg': '#ECFDF5',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          danger: '#EF4444',
          'danger-bg': '#FEF2F2',
          info: '#3B82F6',
          'info-bg': '#EFF6FF',
        },
      },
      borderRadius: {
        card: '12px',
        ctrl: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        drawer: '-4px 0 24px rgba(0, 0, 0, 0.08)',
        modal: '0 20px 40px rgba(0, 0, 0, 0.12)',
      },
    },
  },
};

