# Estier - Desi Hip-Hop Fan Engagement Platform

Built by Asmit & Prakhar | A full-stack MVP for Desi Hip-Hop fans and artists

## 🎯 Features

### ✅ Implemented MVP Features

1. **Authentication**
   - Email + password login/signup with JWT
   - Secure authentication flow
   - User sessions

2. **Live Discussions & Community Feed**
   - Global feed with text posts
   - Anonymous "Hot Takes" mode
   - Real-time reactions (like, fire, crown, skull)
   - Comment system

3. **Polls & Artist Discovery**
   - Monthly polls for voting on songs
   - Dynamic top 10 hot artists leaderboard
   - Emerging artists discovery section
   - Animated progress bars

4. **Curated News Hub**
   - Editorial articles about Desi Hip-Hop
   - Category filtering (release, drama, tour, interview, general)
   - Pre-seeded sample headlines including:
     - KRSNA releases new album with Mass Appeal
     - Seedhe Maut's Encore ABJ controversy
     - Sez on the Beat on creativity
     - Jani vs Panther nationalism debate
     - Seedhe Maut India tour announcement

5. **Tickets & Merch Marketplace**
   - Product listings (tickets & merchandise)
   - **Ticket pairing feature** - Match with 2 or 4 strangers
   - Shopping cart system
   - Order management (no real payment gateway for MVP)

6. **User Profiles**
   - Customizable profiles
   - Top 5 favorite rappers (editable)
   - Recent posts display
   - User statistics

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.io
- **State Management**: Zustand
- **UI Components**: React Icons, React Hot Toast

## 🎨 Design

- **Theme**: Purple (#7C4DFF) + Black (#0A0A0A)
- **Typography**: Poppins
- **Mobile-first responsive design**
- **Smooth animations and micro-interactions**

## 📁 Project Structure

```
estier/
├── components/
│   └── Layout.js          # Main layout with navigation
├── lib/
│   ├── api.js            # Axios instance
│   ├── auth.js           # JWT utilities
│   ├── mongodb.js        # Database connection
│   ├── socket.js         # Socket.io client
│   └── store.js          # Zustand state management
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Poll.js
│   ├── Artist.js
│   ├── News.js
│   ├── Product.js
│   ├── Order.js
│   └── ChatRoom.js
├── pages/
│   ├── api/              # API routes
│   ├── profile/[id].js
│   ├── index.js          # Landing page
│   ├── feed.js           # Community feed
│   ├── polls.js          # Polls & leaderboard
│   ├── news.js           # News hub
│   └── marketplace.js    # Tickets & merch
├── scripts/
│   └── seed.js           # Database seeding
└── styles/
    └── globals.css       # Global styles
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas account)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd estier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env.local` file is already created with default values:
   ```
   MONGODB_URI=mongodb://localhost:27017/estier
   JWT_SECRET=estier-secret-key-change-in-production-2025
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

   **For production**: Update these values with your production database and secure JWT secret.

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Windows
   net start MongoDB

   # On Linux
   sudo systemctl start mongod
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

   This will create:
   - 2 sample users
   - 13 artists (10 hot, 3 emerging)
   - 6 news articles
   - 1 active poll
   - 6 products (3 tickets, 3 merch items)
   - 2 chat rooms

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Sample Login Credentials

After seeding, you can log in with:

- **User 1**
  - Email: `asmit@estier.com`
  - Password: `password123`

- **User 2**
  - Email: `prakhar@estier.com`
  - Password: `password123`

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with auth |
| `/feed` | Community feed with posts |
| `/polls` | Monthly polls + hot artist leaderboard |
| `/news` | Curated Desi Hip-Hop news |
| `/marketplace` | Tickets & merch with pairing |
| `/profile/:id` | User profile with top 5 rappers |

## 🎯 Key Features Showcase

### Ticket Pairing
In the marketplace, when adding tickets to cart:
1. Enable "Pair with strangers" option
2. Select group size (2 or 4)
3. System will auto-match you with other fans

### Anonymous Hot Takes
In the feed:
1. Check "Post anonymously" before posting
2. Your post will appear as "Anonymous"
3. Perfect for controversial opinions!

### Live Chat (Socket.io)
Real-time messaging for track premieres and events (backend ready, can be extended with UI)

## 🚢 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `NEXT_PUBLIC_API_URL`: Your Vercel deployment URL
   - Deploy!

### Database Hosting

**MongoDB Atlas** (Free Tier):
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in Vercel environment variables
5. Run seed script with production database:
   ```bash
   MONGODB_URI=<your-atlas-uri> npm run seed
   ```

## 🧪 Development

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## 🎨 Customization

### Colors
Update in `tailwind.config.js`:
```js
colors: {
  primary: '#7C4DFF',    // Purple
  dark: '#0A0A0A',       // Black
  'dark-gray': '#1A1A1A',
  'mid-gray': '#2A2A2A',
}
```

### Fonts
Update in `pages/_document.js`:
```js
href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
```

## 📝 Future Enhancements

- [ ] Spotify OAuth integration
- [ ] Google OAuth integration
- [ ] Real payment gateway (Razorpay/Stripe)
- [ ] Live chat UI components
- [ ] Push notifications
- [ ] Artist verification system
- [ ] Advanced search & filters
- [ ] User following system
- [ ] Comments on posts
- [ ] Admin panel for content management

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env.local`
- For Atlas: Whitelist your IP address

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👥 Authors

**Asmit & Prakhar**

Built with ❤️ for the Desi Hip-Hop community

---

**Estier** - Where Desi Hip-Hop fans unite! 🎤🔥
