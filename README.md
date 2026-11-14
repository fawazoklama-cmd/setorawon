# SETORAWON

**Share Moments, Stay Connected.**

SETORAWON is a modern, playful, pastel-styled real-time peer-to-peer communication and file-sharing web application built with React, TypeScript, Vite, Tailwind CSS, WebRTC, and PeerJS — with **zero database**.

## Features

- **Real-Time Chat**: Text messages, emoji picker, message replies, copy, local message deletion, timestamps, delivery acknowledgments, typing indicator, and media/document attachments with preview.
- **Peer-to-Peer File Sharing**: Drag & drop or file picker supporting photos, videos, PDF, DOCX, XLSX, PPTX, ZIP, and safe documents using 64 KB chunked streaming to protect browser memory.
- **Voice Calling**: WebRTC audio calls with incoming call notifications, accept/decline controls, mute/unmute, and live call duration timer.
- **Video Calling & Screen Sharing**: Two-way WebRTC video calls, local camera preview, camera/mic toggles, front/back camera switching, fullscreen mode, and Screen Capture API sharing (Entire Screen, Application Window, Browser Tab).
- **Bilingual UI (Multi-Language)**: Instant switch between 🇮🇩 Bahasa Indonesia (default) and 🇺🇸 English, persisted in `LocalStorage`.
- **Light & Dark Mode**: Pastel light theme (`#83BDF7`, `#FFA8CE`, `#F8F9FF`) and soft dark mode persisted in `LocalStorage`.

## Zero-Database Architecture & Limitations

SETORAWON intentionally operates **without any database** (no MySQL, PostgreSQL, MongoDB, Firebase, or Supabase):

- **Ephemeral Messaging & Files**: Chat messages and shared files are sent directly peer-to-peer over WebRTC DataChannels and exist only in active browser memory and temporary `Blob` / Object URLs during the active session. Refreshing or leaving a room clears the conversation.
- **Browser Storage**: Only user preferences (language, theme, device selection, privacy limits), user profile (`username`, `userId`, avatar), and local recent room IDs are stored in `LocalStorage` / `SessionStorage`.
- **Host-Anchored Room Signaling**: When you click **CREATE ROOM**, your browser registers the Room ID on PeerJS Cloud as the session coordinator. If the host closes their tab, new peers cannot join that same Room ID until a host creates it again.

## WebRTC, STUN & TURN Configuration

- **Signaling**: Uses PeerJS Cloud (`0.peerjs.com`) by default. You can optionally configure a custom PeerServer via environment variables (`VITE_PEER_HOST`, `VITE_PEER_PORT`, `VITE_PEER_PATH`). Note that Vercel Serverless Functions do not support persistent WebSocket servers, so an external signaling service (such as PeerJS Cloud or a dedicated Node/PeerServer host) is used.
- **STUN/TURN**: Public Google STUN servers (`stun:stun.l.google.com:19302`) are configured by default. If users connect across strict corporate firewalls or symmetric NATs where direct P2P traversal fails, configure a dedicated TURN relay service (such as Metered, Twilio, or self-hosted `coturn`) via `VITE_TURN_URL`, `VITE_TURN_USERNAME`, and `VITE_TURN_CREDENTIAL` in your `.env` / Vercel project settings.

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 3. Type Check & Production Build

```bash
npm run lint
npm run build
```

## Deploying to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/).
3. Vercel automatically detects Vite:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. `vercel.json` is already included with SPA rewrite rules so refreshing any nested route (`/chat`, `/voice-call`, `/video-call`, `/file-sharing`, `/settings`, `/about`) works without 404 errors.
5. *(Optional)* Add `VITE_TURN_URL`, `VITE_TURN_USERNAME`, `VITE_TURN_CREDENTIAL`, or custom `VITE_PEER_*` variables in **Project Settings -> Environment Variables** if needed. Never expose private server secrets in `VITE_*` variables.

## Credits

- **Application**: SETORAWON
- **Tagline**: Share Moments, Stay Connected.
- **Developer / Engineer**: `@wazzz.dotcom`
- **Instagram**: `@wazzz.dotcom`
- **Requested By**: `mandaa`

Made with love 💗
