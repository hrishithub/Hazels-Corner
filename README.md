# Hazel's Corner

A warm, static-first Next.js 15 app made as a quiet companion space for Hazel during NEET PG preparation.

## Tech

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- Framer Motion
- localStorage for small persistent rituals
- Static JSON content in `content/`

## Pages

- `/` - countdown, daily comfort, tiny win, companion
- `/open-when` - personalized comfort letters by feeling
- `/music` - curated Spotify playlist embeds with handwritten notes
- `/pokemon` - nostalgic companion journey and progression map
- `/letters` - milestone letters with unlock states
- `/calm` - breathing animation and grounding space

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

The exam date is configured in `lib/constants.ts`. Static emotional content lives in `content/openWhen.json`, `content/music.json`, `content/letters.json`, and `content/dailyMessages.json`.
