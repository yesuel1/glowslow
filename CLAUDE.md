# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

아모그램 (Amogram) is an Instagram-style web application for sharing health, beauty, and lifestyle content with AI-generated captions and automated cheerful comments from character personas.

## Key Features

1. Photo + keyword input → AI-generated captions (using Claude API)
2. Automated supportive comments from 4 character personas
3. Instagram-style feed UI with pastel colors

## Character Personas

- 💚 **건강맘 (Health Mom)**: Warm, motherly tone
- ✨ **미보님 (Beauty Expert)**: Professional senior expert tone
- ⭐ **응원이 (Cheerleader)**: Energetic friend tone
- 🌼 **포근이 (Cozy Grandma)**: Gentle grandmother tone

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS with Vite
- **AI**: Claude API (planned for stage 2)
- **Deployment**: Cloudflare Pages (planned)
- **Data**: JSON files (MVP)

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Project Structure

```
src/
├── index.html              # Main HTML entry point
├── css/
│   └── style.css          # Pastel-themed styles with CSS variables
├── js/
│   └── main.js            # Post loading and rendering logic
└── data/
    └── posts.json         # Sample post data (will be replaced with backend)

public/
└── images/                # Static image assets

vite.config.js             # Vite configuration (root: src, build: dist)
```

## Code Architecture

### Styling (src/css/style.css)

- **CSS Variables**: All colors defined in `:root` for easy theming
- **Pastel Palette**: Pink (#FFB3BA), Peach (#FFDFBA), Mint (#BAFFC9), Lavender (#E0BBE4), Sky (#BAE1FF)
- **Design System**: Consistent border-radius (24px for cards, 20px for tags), shadows, and spacing
- **Responsive**: Mobile-first with breakpoint at 640px

### Post Rendering (src/js/main.js)

- `createPostCard(post)`: Generates HTML for a single post card
- `loadPosts()`: Fetches posts.json and renders all posts
- `addNewPost(post)`: Adds a new post to the beginning of the feed
- Posts are rendered in reverse chronological order

### AI Integration (src/js/api.js)

- `generateCaption(keywords, emoji)`: Generates caption using Claude API
- `generateComments(keywords, caption)`: Generates 2-3 supportive comments from character personas
- `generateSingleComment(character, keywords, caption)`: Generates a comment for a specific character
- Each character has a unique persona and speaking style
- Falls back to dummy content if API key is not configured

### Data Model (src/data/posts.json)

Each post object contains:
- `id`: Unique identifier
- `author`, `avatar`: Author info
- `date`: Relative timestamp (e.g., "2시간 전")
- `images`: Array of image URLs or base64 data (up to 10 images)
- `captions`: Array of AI-generated captions (one per image)
- `keywords`: Array of keyword strings
- `comments`: Array of comment objects with `author`, `avatar`, `text`

Legacy posts may still use single `image` and `caption` fields.

## Development Roadmap

- ✅ **Stage 1**: Basic feed UI and post cards
- ✅ **Stage 2**: Photo + keyword input form, Claude API integration for caption generation
- ✅ **Stage 3**: Automated cheerful comment generation (4 character personas)
- ✅ **Stage 4**: Image upload (up to 10) with Instagram-style slider and individual captions

## UI Design Guidelines

- Use pastel colors and soft gradients (Amore brand aesthetic)
- Maintain rounded corners (border-radius: 20-24px)
- Include cute emojis throughout
- Keep interactions smooth with transitions
- Responsive design for mobile and desktop

## Image Slider Features

- **Upload**: Drag & drop or click to select up to 10 images
- **Preview**: Real-time preview grid with remove buttons
- **Slider**: Instagram-style carousel with:
  - Left/right arrow buttons
  - Touch/mouse drag support
  - Page indicators (dots)
  - Photo frame effect (white border overlay)
  - Individual caption per image displayed at bottom
- **Navigation**: Click indicators to jump to specific slide
- **Responsive**: Slider adapts to mobile and desktop screens

## Important Notes

- All user-facing text is in Korean
- Comment personas must match their defined character traits
- Keep the UI clean and Instagram-like with minimal distractions
