# CLUTCHLAB — CS2 Training Hub prototype

A responsive React + Vite prototype with:
- Dashboard and player progress overview
- Interactive Three.js 3D tactical practice environment (original placeholder geometry)
- Aim-click trainer with hit/miss/accuracy counters
- Utility Academy browsing UI
- Community / LFG prototype UI

## Run locally
1. Install Node.js 20 or newer.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Important scope notes
This is a working web prototype, not a complete CS2 game integration.
The 3D scene is original placeholder training geometry, not extracted Valve map data.
The aim trainer runs in the browser and does not control CS2. Real CS2 prefire/bot
scenarios, authentic maps, grenade physics, Steam sign-in, persistent profiles,
multiplayer lobbies and hosted deployment require additional backend/server work,
permissions, assets and testing.

## Suggested next milestones
1. Replace placeholder map scene with licensed/custom map geometry and map data.
2. Add Supabase authentication, database and saved lineups.
3. Add a CS2 dedicated-server integration for real in-game training scenarios.
4. Add real LFG posts, invitations, moderation and anti-abuse controls.
5. Deploy frontend and backend with production monitoring.
