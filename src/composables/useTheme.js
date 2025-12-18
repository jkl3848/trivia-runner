import { ref, computed, onMounted } from 'vue';

export function useTheme() {
  const availableThemes = ref([]);
  const currentTheme = ref(null);
  const loading = ref(false);
  const error = ref('');

  // Helper function to convert gradient config to Tailwind classes
  const getBackgroundClass = computed(() => {
    if (!currentTheme.value) return 'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400';
    
    const bg = currentTheme.value.colors.background;
    if (bg.type === 'solid') {
      return '';
    } else if (bg.type === 'gradient' && bg.gradient) {
      return `bg-gradient-${bg.gradient.direction}`;
    }
    return 'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400';
  });

  const getBackgroundStyle = computed(() => {
    if (!currentTheme.value) return {};
    
    const bg = currentTheme.value.colors.background;
    if (bg.type === 'solid') {
      return { backgroundColor: bg.solid };
    } else if (bg.type === 'gradient' && bg.gradient) {
      // Create CSS gradient from config
      const { from, via, to } = bg.gradient;
      const direction = bg.gradient.direction.replace('to-', '');
      
      let gradientDirection = '';
      if (direction.includes('br')) gradientDirection = 'to bottom right';
      else if (direction.includes('bl')) gradientDirection = 'to bottom left';
      else if (direction.includes('tr')) gradientDirection = 'to top right';
      else if (direction.includes('tl')) gradientDirection = 'to top left';
      else if (direction.includes('r')) gradientDirection = 'to right';
      else if (direction.includes('l')) gradientDirection = 'to left';
      else if (direction.includes('b')) gradientDirection = 'to bottom';
      else if (direction.includes('t')) gradientDirection = 'to top';
      else gradientDirection = 'to bottom right';
      
      if (via) {
        return {
          background: `linear-gradient(${gradientDirection}, ${from}, ${via}, ${to})`,
        };
      } else {
        return {
          background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
        };
      }
    }
    return {};
  });

  const getAnimationSpeed = computed(() => {
    if (!currentTheme.value) return 'normal';
    return currentTheme.value.animations.shapes.speed || 'normal';
  });

  const getAnimationDuration = computed(() => {
    if (!currentTheme.value) return 700;
    return currentTheme.value.animations.transitions.duration || 700;
  });

  const getShapes = computed(() => {
    if (!currentTheme.value || !currentTheme.value.colors.shapes) {
      return [
        { color: '#22d3ee', opacity: 0.2, position: 'top-left', size: 'medium' },
        { color: '#ec4899', opacity: 0.2, position: 'bottom-right', size: 'large' },
        { color: '#fbbf24', opacity: 0.2, position: 'center', size: 'large' }
      ];
    }
    return currentTheme.value.colors.shapes;
  });

  const getShapePositionClass = (position) => {
    const positions = {
      'top-left': 'top-10 left-10',
      'top-right': 'top-10 right-10',
      'bottom-left': 'bottom-20 left-10',
      'bottom-right': 'bottom-20 right-10',
      'center': 'top-1/2 left-1/3',
    };
    return positions[position] || 'top-10 left-10';
  };

  const getShapeSizeClass = (size) => {
    const sizes = {
      'small': 'w-48 h-48',
      'medium': 'w-64 h-64',
      'large': 'w-80 h-80',
    };
    return sizes[size] || 'w-64 h-64';
  };

  const getShapeStyle = (shape) => {
    return {
      backgroundColor: shape.color,
      opacity: shape.opacity,
    };
  };

  const getAnswerStyle = computed(() => {
    if (!currentTheme.value) {
      return {
        background: 'linear-gradient(to right, #34d399, #22d3ee)',
      };
    }
    
    const answer = currentTheme.value.colors.answer;
    if (typeof answer.bg === 'string') {
      return { backgroundColor: answer.bg };
    } else if (answer.bg && answer.bg.type === 'gradient') {
      const { from, via, to, direction } = answer.bg.gradient;
      const dir = direction ? direction.replace('to-', 'to ').replace('-', ' ') : 'to right';
      
      if (via) {
        return { background: `linear-gradient(${dir}, ${from}, ${via}, ${to})` };
      } else {
        return { background: `linear-gradient(${dir}, ${from}, ${to})` };
      }
    }
    return { background: 'linear-gradient(to right, #34d399, #22d3ee)' };
  });

  const getProgressBarStyle = computed(() => {
    if (!currentTheme.value) {
      return {
        background: 'linear-gradient(to right, #22d3ee, #3b82f6, #a855f7)',
      };
    }
    
    const fill = currentTheme.value.colors.progressBar.fill;
    if (typeof fill === 'string') {
      return { backgroundColor: fill };
    } else if (fill && fill.type === 'gradient') {
      const { from, via, to, direction } = fill.gradient;
      const dir = direction ? direction.replace('to-', 'to ').replace('-', ' ') : 'to right';
      
      if (via) {
        return { background: `linear-gradient(${dir}, ${from}, ${via}, ${to})` };
      } else {
        return { background: `linear-gradient(${dir}, ${from}, ${to})` };
      }
    }
    return { background: 'linear-gradient(to right, #22d3ee, #3b82f6, #a855f7)' };
  });

  const getCategoryStyle = (level) => {
    if (!currentTheme.value) return {};
    
    const category = currentTheme.value.colors.categories[level];
    return {
      backgroundColor: category.bg,
      color: category.text,
      borderColor: category.border,
    };
  };

  const getTextColor = computed(() => {
    if (!currentTheme.value) return '#ffffff';
    return currentTheme.value.colors.text.primary;
  });

  const getTypography = (element) => {
    if (!currentTheme.value) {
      const defaults = {
        title: { size: 'text-8xl', weight: 'font-black' },
        question: { size: 'text-6xl', weight: 'font-black' },
        answer: { size: 'text-5xl', weight: 'font-black' },
      };
      return defaults[element] || { size: 'text-base', weight: 'font-normal' };
    }
    return currentTheme.value.typography[element];
  };

  const getLayout = (property) => {
    if (!currentTheme.value) {
      const defaults = {
        spacing: {
          question: 'mb-16',
          categories: 'mb-12',
          answer: 'px-16 py-12',
        },
        borderRadius: {
          categories: 'rounded-full',
          answer: 'rounded-3xl',
        },
      };
      return defaults[property];
    }
    return currentTheme.value.layout[property];
  };

  async function loadThemes() {
    loading.value = true;
    error.value = '';
    
    try {
      if (window.themes) {
        const themes = await window.themes.getThemes();
        availableThemes.value = themes;
        
        // Load first theme by default
        if (themes.length > 0) {
          await selectTheme(themes[0].path);
        }
      }
    } catch (err) {
      error.value = `Failed to load themes: ${err.message}`;
      console.error('Error loading themes:', err);
    } finally {
      loading.value = false;
    }
  }

  async function selectTheme(themePath) {
    loading.value = true;
    error.value = '';
    
    try {
      if (window.themes) {
        const result = await window.themes.loadTheme(themePath);
        
        if (result.success) {
          currentTheme.value = result.data;
        } else {
          error.value = result.error || 'Failed to load theme';
        }
      }
    } catch (err) {
      error.value = `Failed to select theme: ${err.message}`;
      console.error('Error selecting theme:', err);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadThemes();
  });

  return {
    availableThemes,
    currentTheme,
    loading,
    error,
    getBackgroundClass,
    getBackgroundStyle,
    getAnimationSpeed,
    getAnimationDuration,
    getShapes,
    getShapePositionClass,
    getShapeSizeClass,
    getShapeStyle,
    getAnswerStyle,
    getProgressBarStyle,
    getCategoryStyle,
    getTextColor,
    getTypography,
    getLayout,
    loadThemes,
    selectTheme,
  };
}
