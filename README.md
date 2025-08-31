# GizmoOnBase

A Base-native mini-app platform that allows creators to monetize their interactive content ("Gizmos") with USDC tips directly on Base blockchain.

## 🎯 Project Overview

GizmoOnBase enables creators to:
1. **Create embedded wallets** via phone number (using Coinbase CDP)
2. **Submit their Gizmo URLs** (interactive web content)
3. **Get shareable links** with built-in tipping functionality
4. **Receive USDC tips** directly to their embedded wallet on Base
5. **Track analytics** and see leaderboards

Users can discover and tip Gizmos seamlessly within the Base ecosystem.

## 🏗️ Architecture

### Core Components
- **Next.js 15** - Full-stack React framework
- **Coinbase OnchainKit** - Web3 UI components and wallet integration
- **Coinbase CDP SDK** - Embedded wallet creation and management
- **Base Blockchain** - Layer 2 for USDC transactions
- **Prisma + PostgreSQL** - Database for gizmos, creators, and events
- **Vercel** - Hosting and deployment

### Key Features Built
- ✅ **Creator Onboarding** (`/new`) - Phone verification and wallet creation
- ✅ **Gizmo Viewer** (`/g/[slug]`) - Embedded iframe with tip buttons
- ✅ **Creator Dashboard** (`/c/[slug]`) - Analytics and earnings tracking
- ✅ **Tip System** - Real USDC transfers using OnchainKit Transaction components
- ✅ **Event Tracking** - Play, tip, and outbound click analytics
- ✅ **Success Page** (`/created/[slug]`) - Post-creation confirmation with sharing tools

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── events/route.ts          # Analytics event logging
│   │   ├── gizmos/route.ts          # Gizmo CRUD operations
│   │   ├── gizmos/[slug]/route.ts   # Individual gizmo data
│   │   └── wallet/                  # Wallet management APIs
│   │       ├── send-sms/route.ts    # SMS verification
│   │       └── create/route.ts      # Embedded wallet creation
│   ├── new/page.tsx                 # Creator onboarding flow
│   ├── g/[slug]/page.tsx           # Gizmo viewer with tipping
│   ├── c/[slug]/page.tsx           # Creator dashboard
│   ├── created/[slug]/page.tsx     # Success/sharing page
│   └── go/page.tsx                 # External redirect handler
├── components/
│   ├── tip-button.tsx              # USDC tipping component
│   └── onchainkit-provider.tsx     # Web3 context provider
├── lib/
│   ├── coinbase.ts                 # Embedded wallet integration
│   └── prisma.ts                   # Database client
└── prisma/
    └── schema.prisma               # Database schema
```

## 🔧 Technology Stack

### Blockchain & Web3
- **Base Mainnet** - Primary blockchain network
- **OnchainKit** - Coinbase's React components for Web3 UX
- **Coinbase CDP SDK** - Server-side wallet creation and management
- **USDC Contract** - `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (Base)
- **Wagmi + Viem** - Ethereum interaction libraries

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations

### Backend & Database
- **Prisma ORM** with PostgreSQL (Neon)
- **Next.js API Routes** for serverless functions
- **Server-side rendering** and static generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Coinbase Developer Platform account
- Vercel account (for deployment)

### Environment Variables

Create a `.env` file with:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Coinbase CDP API (for Embedded Wallets)
NEXT_PUBLIC_COINBASE_PROJECT_ID="your_project_id"
COINBASE_API_KEY="organizations/your-org-id/apiKeys/your-api-key-id"
COINBASE_PRIVATE_KEY="-----BEGIN EC PRIVATE KEY-----\nyour_private_key\n-----END EC PRIVATE KEY-----"

# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_onchainkit_api_key"

# Optional: Bypass Coinbase API for testing
COINBASE_BYPASS_MODE=false

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_TELEMETRY_DISABLED=1
```

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/bradorbradley/gizmoonbase.git
cd gizmoonbase-clean
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the app.

## 🎮 User Flow

### For Creators
1. **Visit `/new`** - Start gizmo creation
2. **Phone Verification** - Enter phone number, get SMS code
3. **Wallet Creation** - Embedded wallet created automatically
4. **Submit Gizmo** - Paste Gizmo URL and creator handle
5. **Success Page** - Get shareable link and preview
6. **Share & Earn** - Share link to receive USDC tips

### For Users/Tippers
1. **Visit Gizmo Link** (`/g/[slug]`) - View embedded gizmo
2. **Interact** - Play/use the gizmo content
3. **Tip Creator** - Click tip buttons ($0.50, $1, $2 USDC)
4. **Connect Wallet** - Use Coinbase Smart Wallet or connect existing
5. **Complete Transaction** - USDC sent directly to creator

## 💰 Monetization Features

### Tipping System
- **Real USDC transfers** on Base blockchain
- **Multiple tip amounts** ($0.50, $1.00, $2.00)
- **OnchainKit Transaction** components for seamless UX
- **Direct wallet-to-wallet** transfers (no escrow)
- **Gas sponsorship** support

### Analytics Dashboard
- **Total earnings** in USDC
- **View counts** and engagement metrics  
- **Tip frequency** and amounts
- **Leaderboard** rankings
- **Real-time updates**

## 🛠️ Current Status

### ✅ Completed Features
- [x] Creator onboarding flow with phone verification
- [x] Embedded wallet creation (with bypass mode for testing)
- [x] Gizmo submission and URL generation
- [x] Gizmo viewer with iframe embedding
- [x] USDC tipping system using OnchainKit
- [x] Event tracking and analytics
- [x] Creator dashboard with KPIs
- [x] Success page with sharing tools
- [x] Database schema and API endpoints
- [x] Production deployment pipeline

### 🚧 Known Issues & Blockers

#### 1. **Coinbase Embedded Wallets Authentication** (Priority: HIGH)
**Issue**: 401 Unauthorized errors from Coinbase CDP API
- API credentials are correctly configured in Vercel
- Private key format appears correct (PEM)
- Project ID has been verified multiple times
- Same issue occurs locally and in production

**Workaround**: `COINBASE_BYPASS_MODE=true` provides demo wallet for testing

**Debug Steps Taken**:
- [x] Added comprehensive error logging
- [x] Created health check endpoint (`/api/health`)
- [x] Verified credential formats (PEM vs JSON)
- [x] Tested with fresh API keys
- [x] Added environment variable validation

**Next Steps**:
- [ ] Contact Coinbase CDP support with specific error details
- [ ] Test with different API key generation method
- [ ] Consider alternative wallet creation approach

#### 2. **SMS Verification** (Priority: MEDIUM)
**Status**: Currently in demo mode
- Uses fixed verification code: `123456`
- No actual SMS sending implemented

**Integration Options**:
- Twilio SMS API
- AWS SNS
- Coinbase's built-in SMS service (if available)

#### 3. **Production Network Connectivity** (Priority: MEDIUM)
**Issue**: "Failed to fetch" errors in some environments
- May be related to Next.js API route configuration
- Could be CORS or network timeout issues

### 🔄 Testing Status

#### Working Locally (with bypass mode):
- ✅ Phone verification flow
- ✅ Wallet creation (demo mode)
- ✅ Gizmo submission
- ✅ Database operations
- ✅ Success page generation

#### Working in Production:
- ✅ Landing page and static routes
- ✅ Database connectivity
- ✅ Basic API endpoints
- ❌ Wallet creation APIs (500 errors)
- ❌ SMS verification APIs (500 errors)

## 📊 Database Schema

### Core Tables
```sql
-- Creators with embedded wallets
Creator {
  id: String (UUID)
  handle: String (unique)
  phone: String
  payout_address: String
  wallet_provider: String
}

-- Gizmos (interactive content)
Gizmo {
  id: String (UUID)
  slug: String (unique, 10 chars)
  url: String
  title: String
  creator_id: String (FK)
}

-- Analytics events
Event {
  id: String (UUID)
  type: String (play|tip|outbound)
  gizmo_id: String (FK)
  fid: Int? (Farcaster user ID)
  amount_usdc: Decimal?
  tx_hash: String?
  ts: DateTime
}

-- User tracking
User {
  fid: Int (unique)
  basename: String?
  pfp_url: String?
}
```

## 🚀 Deployment

### Production Environment
- **Hosting**: Vercel
- **Database**: Neon PostgreSQL
- **Domain**: https://gizmoonbase-clean.vercel.app
- **Auto-deploy**: Connected to GitHub main branch

### Environment Variables (Vercel)
All production environment variables are configured in Vercel dashboard.

### Build Process
```bash
npx prisma generate
npm run build
```

## 🔌 API Endpoints

### Wallet Management
- `POST /api/wallet/send-sms` - Send SMS verification code
- `POST /api/wallet/create` - Create embedded wallet

### Gizmo Management  
- `POST /api/gizmos` - Create new gizmo
- `GET /api/gizmos/[slug]` - Get gizmo data
- `GET /api/gizmos/[slug]/summary` - Get analytics summary
- `GET /api/gizmos/[slug]/leaderboard` - Get tip leaderboard

### Analytics
- `POST /api/events` - Log user events (play, tip, outbound)

### Health & Debug
- `GET /api/health` - System health check and environment validation

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management
```bash
npx prisma studio    # Open Prisma Studio (GUI)
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
```

## 🤝 Contributing

### Immediate Next Steps for New Developer

1. **Fix Coinbase Authentication**
   - Debug the 401 errors with fresh perspective
   - Consider contacting Coinbase CDP support
   - Test alternative authentication methods

2. **Implement Real SMS Verification**
   - Choose SMS provider (Twilio recommended)
   - Replace demo code with real verification
   - Add proper code storage/expiration

3. **Fix Production API Issues**
   - Debug "Failed to fetch" errors
   - Investigate Next.js API route configuration
   - Test network connectivity in different environments

4. **Enhanced Features**
   - Custom tip amounts
   - Social sharing integration
   - Gizmo categories and discovery
   - Creator profile pages

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration included
- Comprehensive error handling and logging
- Environment-specific configurations

## 📞 Support

For technical issues:
- Check Vercel deployment logs
- Review API endpoint logs
- Use `/api/health` endpoint for diagnostics
- Enable `COINBASE_BYPASS_MODE=true` for testing without wallet integration

---

**Last Updated**: August 31, 2025  
**Status**: Core functionality complete, blocked on Coinbase API authentication