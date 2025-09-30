# 🚀 Quick Start Guide - Estier

Get your Estier platform up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18 or higher (`node --version`)
- ✅ MongoDB installed and running (`mongod --version`)
- ✅ A code editor (VS Code recommended)

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd estier
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js, React
- MongoDB, Mongoose
- Socket.io
- TailwindCSS, Framer Motion
- And more...

### 3. Start MongoDB

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
# Should connect without errors
mongosh
```

### 4. Seed the Database
```bash
npm run seed
```

This creates sample data:
- 2 users (asmit, prakhar)
- 13 artists
- 6 news articles
- 1 active poll
- 6 products
- 2 chat rooms

### 5. Start the Dev Server
```bash
npm run dev
```

### 6. Open in Browser
Navigate to: **http://localhost:3000**

## Login Credentials

Use these to test the platform:

**User 1:**
- Email: `asmit@estier.com`
- Password: `password123`

**User 2:**
- Email: `prakhar@estier.com`
- Password: `password123`

## Testing the Features

### 1. Authentication ✅
- Sign up with a new account
- Log in with sample credentials
- Check if profile persists on refresh

### 2. Community Feed ✅
- Create a new post
- Try "Post anonymously" option
- React to posts (like, fire, crown, skull)

### 3. Polls & Leaderboard ✅
- Vote on the active poll
- View top 10 hot artists
- Check emerging artists section

### 4. News Hub ✅
- Browse news articles
- Filter by category
- Check the 5 seeded headlines

### 5. Marketplace ✅
- Browse tickets and merch
- Add items to cart
- Try the ticket pairing feature:
  1. Add a ticket to cart
  2. Check "Pair with strangers"
  3. Select group size (2 or 4)
  4. Checkout

### 6. User Profile ✅
- Visit your profile
- Click "Edit"
- Add your top 5 favorite rappers
- Save changes

## Common Issues & Solutions

### Port 3000 Already in Use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Restart MongoDB
brew services restart mongodb-community  # macOS
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Project Structure Overview

```
estier/
├── components/       # Reusable UI components
│   └── Layout.js    # Main layout with nav
├── lib/             # Utilities and configs
│   ├── api.js       # API client
│   ├── auth.js      # JWT helpers
│   ├── mongodb.js   # DB connection
│   ├── socket.js    # Socket.io client
│   └── store.js     # State management
├── models/          # Mongoose schemas
├── pages/           # Next.js pages & routes
│   ├── api/         # Backend API routes
│   ├── index.js     # Landing page
│   ├── feed.js      # Community feed
│   ├── polls.js     # Polls & leaderboard
│   ├── news.js      # News hub
│   ├── marketplace.js
│   └── profile/[id].js
├── scripts/
│   └── seed.mjs     # Database seeder
└── styles/
    └── globals.css  # Global styles
```

## Development Workflow

### Making Changes

1. **Edit a component:**
   ```bash
   # Changes auto-reload
   code components/Layout.js
   ```

2. **Add a new page:**
   ```bash
   # Create pages/newpage.js
   # Automatically creates route /newpage
   ```

3. **Modify styles:**
   ```bash
   # Edit styles/globals.css or use Tailwind classes
   ```

### Database Management

**Reset database:**
```bash
npm run seed
```

**View database:**
```bash
mongosh
use estier
db.users.find()
db.posts.find()
```

**Clear specific collection:**
```bash
mongosh
use estier
db.posts.deleteMany({})
```

## Building for Production

### Test Production Build Locally
```bash
npm run build
npm start
```

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Random secure string
   - `NEXT_PUBLIC_API_URL`: Your Vercel URL

## Next Steps

### Extend the Platform

1. **Add Google/Spotify OAuth:**
   - Install `next-auth`
   - Configure OAuth providers
   - Update auth logic

2. **Implement Real Payment:**
   - Integrate Razorpay/Stripe
   - Update order API routes
   - Add payment confirmation

3. **Live Chat UI:**
   - Create chat component
   - Use Socket.io hooks
   - Real-time message display

4. **Admin Panel:**
   - Create `pages/admin.js`
   - Add role-based auth
   - Content management forms

### Customize Design

**Change theme colors:**
```js
// tailwind.config.js
colors: {
  primary: '#YOUR_COLOR',
  dark: '#YOUR_DARK',
}
```

**Update fonts:**
```js
// pages/_document.js
<link href="YOUR_GOOGLE_FONT_URL" />
```

## Need Help?

- 📖 Check the full [README.md](README.md)
- 🐛 Common errors? See troubleshooting above
- 💡 Feature ideas? Extend the codebase!

---

**Happy Coding! 🎤🔥**

Built with ❤️ for the Desi Hip-Hop community
