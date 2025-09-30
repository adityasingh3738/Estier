# 🚀 Getting Started with Estier

Welcome to **Estier** - Your Desi Hip-Hop Fan Engagement Platform!

This guide will get you up and running in **5 minutes**.

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies (2 min)
```bash
cd estier
npm install
```

### Step 2: Start MongoDB (1 min)
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

### Step 3: Seed Database (1 min)
```bash
npm run seed
```

### Step 4: Start App (1 min)
```bash
npm run dev
```

### Step 5: Open Browser
Navigate to: **http://localhost:3000**

## 🔑 Login Credentials

```
Email: asmit@estier.com
Password: password123
```

Or create a new account!

## ✨ What You Get

### 🎯 6 Core Features

1. **Authentication System**
   - Email/password signup & login
   - JWT token-based auth
   - Persistent sessions

2. **Community Feed**
   - Post text, memes, links
   - Anonymous "Hot Takes" mode
   - Reactions: like, fire, crown, skull
   - Real-time updates

3. **Polls & Artist Discovery**
   - Monthly song polls
   - Top 10 hot artists leaderboard
   - Emerging artists section
   - Live vote counting

4. **News Hub**
   - Curated Desi Hip-Hop news
   - Category filters
   - Sample articles included:
     - KRSNA's new album
     - Seedhe Maut drama
     - Sez on the Beat interview
     - And more!

5. **Marketplace**
   - Concert tickets
   - Artist merchandise
   - Shopping cart
   - **Ticket pairing** (meet 2-4 strangers!)
   - Order management

6. **User Profiles**
   - Top 5 favorite rappers
   - Post history
   - Editable profile
   - Follower counts

### 🎨 Beautiful UI

- **Purple & Black Theme** (#7C4DFF + #0A0A0A)
- **Poppins Font** - Clean and modern
- **Smooth Animations** - Framer Motion
- **Mobile Responsive** - Works on all devices
- **Dark Mode** - Easy on the eyes

### 🔥 Tech Stack

```
Frontend:
✓ Next.js 14
✓ React 18
✓ TailwindCSS
✓ Framer Motion
✓ Zustand

Backend:
✓ Next.js API Routes
✓ MongoDB + Mongoose
✓ JWT Auth
✓ Socket.io
✓ Bcrypt
```

## 📱 Navigate the App

### Landing Page (/)
- Hero section
- Feature highlights
- Login/Signup form

### Feed (/feed)
- Create posts
- Anonymous mode toggle
- React to posts
- View community content

### Polls (/polls)
- Vote on tracks
- View leaderboard
- Discover new artists

### News (/news)
- Browse articles
- Filter by category
- Read latest updates

### Marketplace (/marketplace)
- Browse tickets & merch
- Add to cart
- Enable ticket pairing
- Checkout

### Profile (/profile/:id)
- View/edit profile
- Set top 5 rappers
- See post history

## 🎮 Try These Features

### 1. Create an Anonymous Hot Take
1. Go to **Feed**
2. Type your opinion
3. ✅ Check "Post anonymously"
4. Click **Post**
5. Your post appears as "Anonymous"!

### 2. Vote on a Poll
1. Go to **Polls**
2. Click on a song
3. Watch the progress bar animate
4. See live vote counts

### 3. Pair Tickets with Strangers
1. Go to **Marketplace**
2. Add a ticket to cart
3. Open cart (top right)
4. ✅ Check "Pair with strangers"
5. Select group size (2 or 4)
6. Checkout!

### 4. Set Your Top 5 Rappers
1. Go to **Profile**
2. Click **Edit**
3. Enter 5 rapper names
4. Click **Save**
5. They display on your profile!

## 📂 Project Structure

```
estier/
├── pages/           # Routes and pages
├── components/      # React components
├── lib/            # Utilities
├── models/         # Database schemas
├── styles/         # CSS files
└── scripts/        # Seed data

Key Files:
├── README.md           # Full documentation
├── QUICKSTART.md       # This guide
├── DEPLOYMENT.md       # How to deploy
├── PROJECT_SUMMARY.md  # Features overview
└── FILE_STRUCTURE.md   # All files explained
```

## 🔧 Development

### Make Changes
```bash
# Edit any file, changes auto-reload
code pages/feed.js
```

### Reset Database
```bash
npm run seed
```

### Check Linting
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm start
```

## 🌐 Deploy to Production

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repo
   - Add environment variables
   - Deploy!

3. **Set Up MongoDB Atlas**
   - Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Update env vars in Vercel

**Full deployment guide:** See `DEPLOYMENT.md`

## 🛠 Troubleshooting

### Port 3000 in use?
```bash
lsof -ti:3000 | xargs kill -9
```

### MongoDB not connecting?
```bash
# Check if running
mongosh

# Restart
brew services restart mongodb-community
```

### Module errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
rm -rf .next
npm run dev
```

## 📚 Learn More

### Documentation
- 📖 [README.md](README.md) - Complete guide
- ⚡ [QUICKSTART.md](QUICKSTART.md) - Quick start
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy guide
- 📊 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Features
- 📁 [FILE_STRUCTURE.md](FILE_STRUCTURE.md) - File list

### Technologies
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com/docs)
- [MongoDB](https://docs.mongodb.com)
- [Socket.io](https://socket.io/docs)

## 🎯 Next Steps

### Customize It
1. Change colors in `tailwind.config.js`
2. Update fonts in `pages/_document.js`
3. Add your logo/branding
4. Modify content and copy

### Add Features
1. Google/Spotify OAuth
2. Payment gateway (Razorpay/Stripe)
3. Live chat UI
4. Push notifications
5. Admin panel

### Go Live
1. Deploy to Vercel
2. Set up custom domain
3. Share with community
4. Gather feedback
5. Iterate!

## ✅ You're All Set!

You now have a **fully functional** Desi Hip-Hop platform with:

✓ Authentication
✓ Social feed
✓ Polls & voting
✓ News hub
✓ E-commerce
✓ User profiles
✓ Real-time features
✓ Mobile responsive
✓ Production ready

## 🤝 Contribute

Want to improve Estier?

1. Fork the repo
2. Make changes
3. Submit PR
4. See `CONTRIBUTING.md`

## 📞 Support

- 📖 Check documentation
- 🐛 Report bugs in Issues
- 💡 Request features
- 🤝 Join discussions

---

**Built with ❤️ for the Desi Hip-Hop community**

Now go build something amazing! 🎤🔥
