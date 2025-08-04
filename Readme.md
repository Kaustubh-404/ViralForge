```markdown
```
# 🎭 ViralForge - Where Memes Meet Web3 Economics

[![YouTube Demo](https://img.shields.io/badge/YouTube-Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/RuDiHXnxoms?feature=shared)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Built with](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Etherlink-purple?style=for-the-badge)](https://etherlink.com/)
[![Mobile](https://img.shields.io/badge/Mobile-Mini%20App-green?style=for-the-badge)](https://t.me/ViralForgeBot)

> **The first web3 platform bringing financial value to meme creation and curation. Create, vote, and earn from the internet's favorite content while building a true community around humor.**
> 
> **🚀 Available as both Web App and Telegram Mini App!**

## 🎬 Demo Video

[![ViralForge Demo](https://img.youtube.com/vi/RuDiHXnxoms/maxresdefault.jpg)](https://youtu.be/RuDiHXnxoms?feature=shared)

*Click to watch the full demo on YouTube*

## 📱 Platform Availability

### 🌐 Web Application
- **URL**: [https://viralforge.vercel.app](https://viralforge.vercel.app)
- **Features**: Full desktop and mobile web experience
- **Wallet**: MetaMask integration
- **Responsive**: Works on all screen sizes

*Experience the same powerful meme creation and voting platform in both formats!*

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Setup Instructions](#️-setup-instructions)
- [🔧 Configuration](#-configuration)
- [📁 Project Structure](#-project-structure)
- [🎯 How It Works](#-how-it-works)
- [🔗 Smart Contract](#-smart-contract)
- [📱 Mini App Integration](#-mini-app-integration)
- [🛠️ Tech Stack](#️-tech-stack)
- [🎮 Usage Guide](#-usage-guide)
- [🔧 Development](#-development)

## 🌟 Features

### 🎨 Template Creation Studio
- Upload and create original meme templates
- Advanced meme editor with draggable text
- Earn royalties from template usage
- Works seamlessly in both web and Telegram

### 🗳️ Humor Prediction Markets
- Simple swipe interface (Right = Funny, Left = Lame)
- Stake 0.0001 XTZ per vote
- Democratic humor validation
- 6-hour settlement period

### 💰 Decentralized Rewards
- 95% to winning voters, 5% to creators
- Automatic settlement after 6 hours
- Fair reward distribution based on contribution
- Real-time earnings tracking

### 👥 Three-Pillar Ecosystem
- **Template Creators**: The visionaries who spot emerging meme potential
- **Meme Creators**: The storytellers who transform templates into hilarious content
- **Meme Consumers**: The validators who discover, curate, and earn for accurate taste predictions

### 📱 Multi-Platform Experience
- **Web App**: Full-featured desktop and mobile web experience
- **Telegram Mini App**: Native Telegram integration with TON Wallet
- **Cross-Platform**: Seamless synchronization across all platforms
- **Mobile-First**: Optimized for mobile usage patterns

## 🏗️ Architecture

```mermaid```
graph TB
    A[Web Frontend - Next.js] --> B[Backend API - Express.js]
    C[Telegram Mini App] --> B
    B --> D[MongoDB Database]
    B --> E[Smart Contract]
    E --> F[Etherlink Testnet]
    B --> G[Auto-Settlement Service]
    A --> H[IPFS Storage - Lighthouse]
    C --> H
    A --> I[MetaMask Wallet]
    C --> J[TON Wallet / Telegram Wallet]
    B --> K[Settlement Tracking]
    L[Cron Jobs] --> G


## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- pnpm (recommended) or npm
- MetaMask wallet (for web) or Telegram account (for mini app)
- MongoDB database
- Lighthouse API key for IPFS

### 1-Minute Setup
Clone the repository:
```bash
git clone https://github.com/your-username/viralforge.git
cd viralforge
```

Install dependencies for both client and server:
```bash
cd client && pnpm install
cd ../server && pnpm install
```

Set up environment variables (see Configuration section):
```bash
cp .env.example .env
```

Start development servers in two terminals:

Terminal 1 - Server:
```bash
cd server && pnpm dev
```

Terminal 2 - Client:
```bash
cd client && pnpm dev
```

Visit `http://localhost:3000` to start creating memes! 🎉

## ⚙️ Setup Instructions

### Client Setup

Navigate to client directory:
```bash
cd client
```

Install dependencies:
```bash
pnpm install
```

Create environment file:
```bash
cp .env.example .env
```

Start development server:
```bash
pnpm dev
```

The client will be available at `http://localhost:3000`

### Server Setup

Navigate to server directory:
```bash
cd server
```

Install dependencies:
```bash
pnpm install
```

Create environment file:
```bash
cp .env.example .env
```

Start development server:
```bash
pnpm dev
```

The server will be available at `http://localhost:5000`

## 🔧 Configuration

### Server Environment Variables

Create `server/.env` with the following variables:

```env
# Database Configuration
MONGODB_URI="mongodb+srv://kaustubh2003:khp2003@cluster0meme.jzbogdy.mongodb.net/memes?retryWrites=true&w=majority&appName=Cluster0meme"

# Blockchain Configuration
RPC_URL="https://node.ghostnet.etherlink.com"
PRIVATE_KEY="Deployer's Private key"

# Server Configuration
PORT=5000
```

### Client Environment Variables

Create `client/.env` with the following variables:

```env
# IPFS Storage
NEXT_PUBLIC_LIGHTHOPSE_GATEWAY="8d8e4045.2cc0a062757443f5a70ae572c77fbcee"

# True Network
NEXT_PUBLIC_TRUE_NETWORK_SECRET_KEY="0x078769bf0088ebe63da14ee1f660d5c8c20a1e6ac57286ef73013b245459579d"

# Environment
NEXT_PUBLIC_PROD=False

# Optional: Spline 3D Scene
NEXT_PUBLIC_SPLINE=""
```

### Contract Address Configuration

If you deploy a new smart contract, update the contract address in these files:

Client Configuration:
```javascript
// client/lib/ethers.ts
export const DEPLOYED_CONTRACT = 'YOUR_NEW_CONTRACT_ADDRESS';
```

Server Configuration:
```javascript
// server/server.js (line 21)
const contractAddress = "YOUR_NEW_CONTRACT_ADDRESS";

// server/services/settlementService.js (line 12)
this.contractAddress = "YOUR_NEW_CONTRACT_ADDRESS";
```

**Current Contract Address:** `0x8045d6B10716F5Ea2c425409e106a619a08ba15D`

## 📁 Project Structure

```
viralforge/
├── client/                     # Frontend Next.js application
│   ├── app/                   # App router pages
│   │   ├── app/              # Main application pages
│   │   │   ├── memes/       # Meme-related pages
│   │   │   │   ├── create/  # Meme creation
│   │   │   │   ├── settlements/ # User settlements
│   │   │   │   └── templates/ # Template viewing
│   │   │   └── layout.tsx   # App layout
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/           # Reusable React components
│   │   ├── meme-creator/    # Meme creation components
│   │   ├── Landing/         # Landing page components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utility libraries
│   ├── config/              # Configuration files
│   └── true-network/        # True Network integration
│
└── server/                   # Backend Express.js application
    ├── models/              # Database models
    │   └── Settlement.js    # Settlement tracking
    ├── services/            # Business logic services
    │   └── settlementService.js # Auto-settlement service
    ├── model.js             # Main database models
    ├── server.js            # Main server file
    └── FunnyOrFud.json      # Smart contract ABI


## 🎯 How It Works

### 1. Template Creation 🎨
- Users upload images or photos to create meme templates
- Templates are stored on IPFS for decentralized access
- Smart contract creates a prediction market for each template

### 2. Meme Creation ✍️
- Users select templates and add custom text
- Advanced editor with draggable, resizable text boxes
- Final memes are stored on IPFS and linked to templates

### 3. Voting & Prediction 🗳️
- Simple swipe interface: Right = Funny, Left = Lame
- Each vote costs 0.0001 XTZ (low barrier to entry)
- 6-hour voting period for fair settlement

### 4. Automatic Settlement ⚡
- Cron job checks for expired markets every 5 minutes
- Smart contract automatically distributes rewards
- 95% to winning voters, 5% to template creators

### 5. Settlement Tracking 📊
- Database tracks all user votes and settlements
- Users can view their betting history and earnings
- Real-time settlement status updates

## 🔗 Smart Contract

### Contract Details
- **Network**: Etherlink Testnet
- **Address**: `0x8045d6B10716F5Ea2c425409e106a619a08ba15D`
- **Explorer**: [View on Etherlink Explorer](https://testnet.explorer.etherlink.com/address/0x8045d6B10716F5Ea2c425409e106a619a08ba15D)

### Key Functions
```solidity
// Create a new meme template market
function createMarket(string memory metadata) external

// Create a meme using existing template
function createMeme(address creator, string memory cid, uint256 templateId) external

// Vote on meme humor (funny/lame)
function vote(address userAddress, uint256 marketId, bool voteYes) external payable

// Settle market and distribute rewards
function releaseRewards(uint256 marketId) external

### Contract Features
- **Vote Cost**: 0.0001 XTZ per vote
- **Market Duration**: 6 hours
- **Creator Reward**: 5% of total pool
- **Voter Rewards**: 95% distributed among winners

## 📱 Mini App Integration

### Telegram Mini App Features
- **Native Integration**: Seamlessly works within Telegram
- **TON Wallet Support**: Direct integration with TON blockchain wallets
- **Telegram Wallet**: Built-in Telegram wallet support
- **Social Features**: Share memes directly in Telegram chats
- **Notifications**: Real-time settlement notifications

### How to Access Mini App
1. Open Telegram
2. Search for `@ViralForgeBot`
3. Start the bot and click "Launch App"
4. Connect your TON Wallet or Telegram Wallet
5. Start creating and voting on memes!

### Mini App vs Web App
| Feature | Web App | Mini App |
|---------|---------|----------|
| Wallet | MetaMask | TON/Telegram Wallet |
| Platform | Browser | Telegram |
| Installation | None | None |
| Sharing | External | Native Telegram |
| Notifications | Browser | Telegram |

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **Web3**: Wagmi + Viem
- **Wallet**: MetaMask integration
- **Storage**: IPFS via Lighthouse
- **State Management**: React hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain**: ethers.js
- **Job Scheduling**: node-cron
- **Storage**: IPFS integration

### Blockchain
- **Network**: Etherlink Testnet (XTZ)
- **Smart Contract**: Solidity
- **Wallet Integration**: MetaMask
- **Gas Token**: XTZ

### Mini App Stack
- **Framework**: Telegram Mini Apps API
- **Wallet**: TON Connect
- **Integration**: Telegram Bot API
- **Sharing**: Telegram Web Apps

## 🎮 Usage Guide

### For Template Creators
1. Connect your MetaMask wallet (web) or TON wallet (mini app)
2. Navigate to "Create" section
3. Upload an image or take a photo
4. Wait for IPFS upload and smart contract deployment
5. Earn 5% from every vote on your template!

### For Meme Creators
1. Browse existing templates
2. Select a template you like
3. Add custom text with the drag-and-drop editor
4. Publish your meme to the template's market
5. Share your creation on social media

### For Voters/Curators
1. Browse meme templates and their content
2. Swipe right (👍) for funny memes
3. Swipe left (👎) for lame memes
4. Pay 0.0001 XTZ per vote
5. Win rewards if you're in the majority after 6 hours!

### Settlement Tracking
1. Visit the "Settlements" page
2. View your voting history
3. See win/loss status for each bet
4. Track your total earnings
5. View settlement transaction details

## 🔧 Development

### Adding New Features

Frontend Components:
```bash
cd client/components
# Add your new component
```

Backend Routes:
```bash
cd server
# Add routes to server.js
```

Database Models:
```bash
cd server/models
# Add new Mongoose models
```

### Testing

Test frontend:
```bash
cd client && pnpm build
```

Test backend:
```bash
cd server && pnpm start
```

### Environment Setup

Server .env.example:
```env
MONGODB_URI="your_mongodb_connection_string"
RPC_URL="https://node.ghostnet.etherlink.com"
PRIVATE_KEY="your_private_key"
PORT=5000
```

Client .env.example:
```env
NEXT_PUBLIC_LIGHTHOPSE_GATEWAY="your_lighthouse_api_key"
NEXT_PUBLIC_TRUE_NETWORK_SECRET_KEY="your_true_network_key"
NEXT_PUBLIC_PROD=False
NEXT_PUBLIC_SPLINE="your_spline_scene_id"
```


