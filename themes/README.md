# Trivia Runner Themes

This directory contains theme files that customize the appearance of your trivia game.

## How to Add a New Theme

1. Create a new JSON file in this directory (e.g., `my-theme.json`)
2. Follow the schema structure shown in the example themes
3. The app will automatically detect and load your new theme
4. Select it from the "Theme" dropdown in the control panel

## Theme Schema

```json
{
  "name": "Theme Display Name",
  "description": "Brief description of your theme",
  "colors": {
    "background": {
      "type": "gradient | solid",
      "gradient": {
        "from": "#hexcolor",
        "via": "#hexcolor",
        "to": "#hexcolor",
        "direction": "to-br | to-r | to-bl | etc"
      },
      "solid": "#hexcolor"
    },
    "text": {
      "primary": "#hexcolor",
      "secondary": "#hexcolor"
    },
    "categories": {
      "main": { "bg": "#hexcolor", "text": "#hexcolor", "border": "#hexcolor" },
      "sub": { "bg": "#hexcolor", "text": "#hexcolor", "border": "#hexcolor" },
      "subsub": {
        "bg": "#hexcolor",
        "text": "#hexcolor",
        "border": "#hexcolor"
      }
    },
    "answer": {
      "bg": "#hexcolor or gradient config",
      "text": "#hexcolor",
      "border": "#hexcolor"
    },
    "progressBar": {
      "background": "#hexcolor",
      "fill": "#hexcolor or gradient config"
    },
    "shapes": [
      {
        "color": "#hexcolor",
        "opacity": 0.2,
        "position": "top-left | bottom-right | center",
        "size": "small | medium | large"
      }
    ]
  },
  "typography": {
    "title": {
      "size": "text-8xl | text-7xl | etc",
      "weight": "font-black | font-bold | etc"
    },
    "question": {
      "size": "text-6xl | text-5xl | etc",
      "weight": "font-black | font-bold | etc"
    },
    "answer": {
      "size": "text-5xl | text-4xl | etc",
      "weight": "font-black | font-bold | etc"
    },
    "category": {
      "main": { "size": "text-xl", "weight": "font-bold" },
      "sub": { "size": "text-lg", "weight": "font-semibold" },
      "subsub": { "size": "text-base", "weight": "font-medium" }
    }
  },
  "animations": {
    "enabled": true,
    "shapes": {
      "enabled": true,
      "speed": "slow | normal | fast"
    },
    "transitions": {
      "enabled": true,
      "duration": 300
    }
  },
  "layout": {
    "spacing": {
      "question": "mb-16 | mb-12 | mb-8",
      "categories": "mb-12 | mb-8 | mb-6",
      "answer": "px-16 py-12 | px-12 py-8 | px-8 py-6"
    },
    "borderRadius": {
      "categories": "rounded-full | rounded-2xl | rounded-lg",
      "answer": "rounded-3xl | rounded-2xl | rounded-xl"
    }
  }
}
```

## Color Formats

- Use hex colors: `#RRGGBB` or `#RGB`
- For gradients, use Tailwind gradient directions: `to-br`, `to-r`, `to-tr`, etc.
- Opacity values should be between 0 and 1

## Tips

- Keep high contrast between text and backgrounds for readability
- Test your theme in both 9:16 and 16:9 aspect ratios
- Use colors that work well for video recording
- Consider color blindness when choosing colors
