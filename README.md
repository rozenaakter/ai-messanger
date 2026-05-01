# 💬 AI Chat

A real-time group chat application with AI integration built with Next.js and Socket.io.

## 🌐 Live Demo
[AI Chat](https://ai-messanger.vercel.app)

## ✨ Features

- **Real-time Messaging** — Instant message delivery using Socket.io
- **AI Integration** — Smart AI responses when mentioning `@ai`
- **Online Status** — See who's online in real-time
- **Typing Indicators** — Know when others are typing
- **Message Read Receipts** — See who read your messages
- **Emoji Reactions** — React to messages with emojis
- **Message Edit & Delete** — Edit or delete your own messages
- **Responsive Design** — Works on all devices

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **AI Service:** OpenRouter API
- **Deployment:** Vercel (Frontend), Railway (Backend)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- OpenRouter API Key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/rozenaakter/ai-messanger.git
cd ai-messanger
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env.local` file**
OPENROUTER_API_KEY=your_api_key_here
**4. Clone and run the server**
```bash
git clone https://github.com/rozenaakter/ai-chat-server.git
cd ai-chat-server
npm install
node server.js
```

**5. Run the frontend**
```bash
npm run dev
```

**6. Open your browser**
http://localhost:3000

## 💡 How to use

- Enter your name to join the chat
- Type a message and press **Enter** or click **Send**
- Mention **@ai** to get AI responses
- Hover over messages to **Edit**, **Delete**, or **React**

## 📁 Project Structure

ai-messanger/
├── app/
│   ├── api/
│   │   └── ai/route.ts      # AI API endpoint
│   └── page.tsx             # Main chat page
├── components/
│   ├── Sidebar.tsx          # Online users sidebar
│   ├── ChatWindow.tsx       # Chat messages window
│   ├── MessageBubble.tsx    # Individual message component
│   └── InputBar.tsx         # Message input bar
└── lib/
└── socket.ts            # Socket.io client


## 👩‍💻 Developer

**Most Rozena Akter**
- GitHub: [@rozenaakter](https://github.com/rozenaakter)