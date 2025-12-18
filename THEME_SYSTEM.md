# Theme System Documentation

## Overview
The Trivia Runner now includes a fully customizable theme system that allows users to create and add their own visual styles.

## What's New

### 1. Theme Directory Structure
- **Location**: `/themes/` folder in the project root
- **Files**: JSON files containing theme configurations
- **Included Themes**:
  - `vibrant-sunset.json` - Bold gradient with violet, fuchsia, and orange tones (default)
  - `ocean-breeze.json` - Cool blues and teals with a calming ocean vibe
  - `midnight-neon.json` - Dark theme with vibrant neon accents
  - `minimal-light.json` - Clean and simple light theme with subtle accents

### 2. Theme Schema
Each theme file must follow the JSON schema defined in `src/themeSchema.js`, which includes:

- **Colors**: Background gradients/solids, text colors, category badges, answer boxes, progress bars, animated shapes
- **Typography**: Font sizes and weights for title, questions, answers, and categories
- **Animations**: Enable/disable animations, speed settings, transition durations
- **Layout**: Spacing and border radius configurations

### 3. Features Implemented

#### Backend (Electron Main Process)
- **Theme Loading**: `getThemeFiles()` scans the themes directory
- **Validation**: AJV schema validation for all theme files
- **IPC Handlers**: `get-themes` and `load-theme` for renderer communication
- **Error Handling**: Invalid themes are logged but don't break the app

#### Frontend (Vue Components)
- **useTheme Composable** (`src/composables/useTheme.js`):
  - Manages theme state and switching
  - Provides computed properties for all themeable elements
  - Converts theme JSON to CSS styles and Tailwind classes
  - Handles gradient directions, colors, and dynamic styling

- **App.vue Updates**:
  - Theme dropdown selector in control panel
  - Dynamic background gradients or solid colors
  - Themeable animated shapes (position, size, color, opacity)
  - Custom category badge colors and styles
  - Dynamic question and answer typography
  - Themed progress bar with custom gradients
  - Animated transitions with configurable durations

### 4. How to Use

#### Selecting a Theme
1. Open the Trivia Runner app
2. In the control panel sidebar, find the "Theme" dropdown
3. Select any theme from the list
4. The app immediately applies the new theme

#### Creating a New Theme
1. Navigate to the `/themes/` directory
2. Create a new JSON file (e.g., `my-theme.json`)
3. Copy the structure from an existing theme
4. Customize the values:
   ```json
   {
     "name": "My Custom Theme",
     "description": "A unique theme for my trivia game",
     "colors": {
       "background": {
         "type": "gradient",
         "gradient": {
           "from": "#your-color",
           "via": "#your-color",
           "to": "#your-color",
           "direction": "to-br"
         }
       },
       ...
     }
   }
   ```
5. Restart the app (or it will auto-detect on next launch)
6. Your theme will appear in the dropdown

### 5. Theme Properties Explained

#### Background
- **Type**: `gradient` or `solid`
- **Gradient**: Requires `from`, `to`, and optionally `via` colors, plus `direction`
- **Solid**: Single color value

#### Colors
- Use hex format: `#RRGGBB` or `#RGB`
- Or rgba: `rgba(r, g, b, a)`
- All text should have good contrast with backgrounds

#### Typography
- Sizes use Tailwind classes: `text-xl`, `text-6xl`, etc.
- Weights: `font-black`, `font-bold`, `font-semibold`, etc.

#### Shapes
- Array of animated background shapes
- Each shape has: `color`, `opacity`, `position`, `size`
- Positions: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center`
- Sizes: `small`, `medium`, `large`

#### Animations
- Control whether shapes animate
- Set speed: `slow`, `normal`, `fast`
- Configure transition duration (milliseconds)

### 6. Best Practices

- **Contrast**: Ensure text is readable against backgrounds
- **Consistency**: Keep similar elements visually related
- **Video Recording**: Choose colors that work well on camera
- **Testing**: Test in both 9:16 and 16:9 aspect ratios
- **Accessibility**: Consider color blindness when selecting colors

### 7. Technical Details

#### File Structure
```
trivia-runner/
├── themes/
│   ├── README.md (user documentation)
│   ├── vibrant-sunset.json
│   ├── ocean-breeze.json
│   ├── midnight-neon.json
│   └── minimal-light.json
└── src/
    ├── themeSchema.js (validation schema)
    ├── composables/
    │   └── useTheme.js (theme composable)
    ├── main.js (IPC handlers)
    ├── preload.js (context bridge)
    └── App.vue (theme application)
```

#### How It Works
1. **Startup**: App loads all themes from `/themes/` directory
2. **Validation**: Each theme is validated against the JSON schema
3. **Default**: First valid theme is loaded automatically
4. **Selection**: User selects theme from dropdown
5. **Application**: Vue composable converts theme to CSS/classes
6. **Rendering**: Components receive computed styles and classes

### 8. Troubleshooting

**Theme Not Appearing in Dropdown**
- Check JSON syntax (use a JSON validator)
- Ensure all required fields are present
- Look for validation errors in the console

**Colors Not Applying**
- Verify hex color format
- Check that gradient direction is valid
- Ensure opacity values are between 0 and 1

**App Won't Start After Adding Theme**
- Invalid JSON will be skipped with a warning
- Check console for error messages
- Remove or fix the problematic theme file

## Future Enhancements (Optional)
- Theme preview thumbnails
- Live theme editor in the app
- Export/import themes
- Theme marketplace/sharing
- More granular control over animations
- Custom fonts support
