# trivia-runner

An electron app that runs endless trivia for streaming on YouTube.

## Stack

Built using electron-forge, Vue 3 and Tailwind.

## Prerequisites

- Node.js ≥ v16.4.0
- Yarn (or npm/pnpm)

## Installation

```bash
# Clone the repository
git clone https://github.com/jkl3848/trivia-runner.git
cd trivia-runner

# Install dependencies
yarn install
```

## Development

```bash
# Start the app in development mode
yarn start
```

The app will launch with hot-reloading enabled. Type `rs` in the terminal to restart the main process.

## Usage

### Loading Trivia Files

1. Launch the app with `yarn start`
2. On the main menu, you can:
   - Click **"Browse for Trivia File"** to select any JSON trivia file from your system
   - Click on any of the **available trivia files** listed (from the `trivia_configs/` folder)

### Playing Trivia

Once a trivia file is loaded, the trivia automatically starts playing:

- Questions display for 60 seconds each
- Answers automatically reveal at 10 seconds remaining (50 seconds into each question)
- A progress bar at the bottom fills to show time remaining
- Questions are shown in random order and loop endlessly
- Perfect for recording and streaming - no interaction needed!

### Trivia File Format

Trivia files must be JSON files following this structure:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "answer": "Paris",
      "category": {
        "main": "General Knowledge",
        "sub": "Geography",
        "subsub": "Capitals"
      }
    }
  ]
}
```

See `trivia_configs/README.md` for detailed format documentation.

### Features

- ✅ **Vertical Video Format**: Optimized for 1080x1920 (9:16 aspect ratio) - perfect for YouTube Shorts, TikTok, and Instagram Reels
- ✅ **Auto-Play Mode**: Automatically starts when a trivia file is loaded
- ✅ **Smart Answer Reveal**: Answers automatically appear at 10 seconds remaining
- ✅ **Progress Bar**: Visual countdown bar at the bottom showing time until next question
- ✅ **Random Question Order**: Questions are shuffled and displayed in random order
- ✅ **Endless Loop**: Questions loop continuously - perfect for streaming
- ✅ **60-Second Intervals**: Each question is displayed for exactly 60 seconds
- ✅ **Schema Validation**: Trivia files are validated on load to ensure proper format
- ✅ **Engaging Visuals**: Modern gradient backgrounds with animated effects
- ✅ **No Interaction Needed**: Fully automated for video recording

## Building

```bash
# Package the app
yarn package

# Create distributable installers
yarn make
```

The output will be in the `out/` directory.

## Project Structure

```
trivia-runner/
├── src/
│   ├── main.js          # Electron main process
│   ├── preload.js       # Preload script for secure context bridge
│   ├── renderer.js      # Vue app entry point
│   ├── App.vue          # Main Vue component
│   └── style.css        # Tailwind CSS imports
├── index.html           # HTML entry point
├── forge.config.js      # Electron Forge configuration
├── vite.main.config.js  # Vite config for main process
├── vite.preload.config.js  # Vite config for preload script
├── vite.renderer.config.js # Vite config for renderer (Vue)
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Technologies

- **Electron** - Cross-platform desktop apps
- **Electron Forge** - Complete build pipeline
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework

## License

See LICENSE file.
