// JSON Schema for Trivia Runner Themes
export const themeSchema = {
  type: 'object',
  required: ['name', 'description', 'colors', 'typography', 'animations', 'layout'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    description: {
      type: 'string',
      maxLength: 200,
    },
    colors: {
      type: 'object',
      required: ['background', 'text', 'categories', 'answer', 'progressBar'],
      properties: {
        background: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: ['gradient', 'solid'],
            },
            gradient: {
              type: 'object',
              properties: {
                from: { type: 'string', pattern: '^#[0-9A-Fa-f]{3,6}$|^rgba?\\(' },
                via: { type: 'string', pattern: '^#[0-9A-Fa-f]{3,6}$|^rgba?\\(' },
                to: { type: 'string', pattern: '^#[0-9A-Fa-f]{3,6}$|^rgba?\\(' },
                direction: { type: 'string' },
              },
            },
            solid: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{3,6}$|^rgba?\\(',
            },
          },
        },
        text: {
          type: 'object',
          required: ['primary', 'secondary'],
          properties: {
            primary: { type: 'string' },
            secondary: { type: 'string' },
          },
        },
        categories: {
          type: 'object',
          required: ['main', 'sub', 'subsub'],
          properties: {
            main: {
              type: 'object',
              required: ['bg', 'text', 'border'],
              properties: {
                bg: { type: 'string' },
                text: { type: 'string' },
                border: { type: 'string' },
              },
            },
            sub: {
              type: 'object',
              required: ['bg', 'text', 'border'],
              properties: {
                bg: { type: 'string' },
                text: { type: 'string' },
                border: { type: 'string' },
              },
            },
            subsub: {
              type: 'object',
              required: ['bg', 'text', 'border'],
              properties: {
                bg: { type: 'string' },
                text: { type: 'string' },
                border: { type: 'string' },
              },
            },
          },
        },
        answer: {
          type: 'object',
          required: ['text', 'border'],
          properties: {
            bg: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    type: { const: 'gradient' },
                    gradient: { type: 'object' },
                  },
                },
              ],
            },
            text: { type: 'string' },
            border: { type: 'string' },
          },
        },
        progressBar: {
          type: 'object',
          required: ['background', 'fill'],
          properties: {
            background: { type: 'string' },
            fill: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    type: { const: 'gradient' },
                    gradient: { type: 'object' },
                  },
                },
              ],
            },
          },
        },
        shapes: {
          type: 'array',
          items: {
            type: 'object',
            required: ['color', 'opacity', 'position', 'size'],
            properties: {
              color: { type: 'string' },
              opacity: { type: 'number', minimum: 0, maximum: 1 },
              position: {
                type: 'string',
                enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'],
              },
              size: {
                type: 'string',
                enum: ['small', 'medium', 'large'],
              },
            },
          },
        },
      },
    },
    typography: {
      type: 'object',
      required: ['title', 'question', 'answer', 'category'],
      properties: {
        title: {
          type: 'object',
          required: ['size', 'weight'],
          properties: {
            size: { type: 'string' },
            weight: { type: 'string' },
          },
        },
        question: {
          type: 'object',
          required: ['size', 'weight'],
          properties: {
            size: { type: 'string' },
            weight: { type: 'string' },
          },
        },
        answer: {
          type: 'object',
          required: ['size', 'weight'],
          properties: {
            size: { type: 'string' },
            weight: { type: 'string' },
          },
        },
        category: {
          type: 'object',
          required: ['main', 'sub', 'subsub'],
          properties: {
            main: {
              type: 'object',
              required: ['size', 'weight'],
              properties: {
                size: { type: 'string' },
                weight: { type: 'string' },
              },
            },
            sub: {
              type: 'object',
              required: ['size', 'weight'],
              properties: {
                size: { type: 'string' },
                weight: { type: 'string' },
              },
            },
            subsub: {
              type: 'object',
              required: ['size', 'weight'],
              properties: {
                size: { type: 'string' },
                weight: { type: 'string' },
              },
            },
          },
        },
      },
    },
    animations: {
      type: 'object',
      required: ['enabled', 'shapes', 'transitions'],
      properties: {
        enabled: { type: 'boolean' },
        shapes: {
          type: 'object',
          required: ['enabled', 'speed'],
          properties: {
            enabled: { type: 'boolean' },
            speed: {
              type: 'string',
              enum: ['slow', 'normal', 'fast'],
            },
          },
        },
        transitions: {
          type: 'object',
          required: ['enabled', 'duration'],
          properties: {
            enabled: { type: 'boolean' },
            duration: { type: 'number', minimum: 0 },
          },
        },
      },
    },
    layout: {
      type: 'object',
      required: ['spacing', 'borderRadius'],
      properties: {
        spacing: {
          type: 'object',
          required: ['question', 'categories', 'answer'],
          properties: {
            question: { type: 'string' },
            categories: { type: 'string' },
            answer: { type: 'string' },
          },
        },
        borderRadius: {
          type: 'object',
          required: ['categories', 'answer'],
          properties: {
            categories: { type: 'string' },
            answer: { type: 'string' },
          },
        },
      },
    },
  },
};
