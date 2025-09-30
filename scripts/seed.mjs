import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/estier';

// Define schemas inline for seeding
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  avatar: String,
  topRappers: [String],
  followers: [mongoose.Schema.Types.ObjectId],
  following: [mongoose.Schema.Types.ObjectId],
}, { timestamps: true });

const ArtistSchema = new mongoose.Schema({
  name: String,
  image: String,
  bio: String,
  followers: [mongoose.Schema.Types.ObjectId],
  hotScore: Number,
  isEmerging: Boolean,
  spotifyUrl: String,
  instagramUrl: String,
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
  headline: String,
  summary: String,
  content: String,
  image: String,
  link: String,
  category: String,
  author: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const PollSchema = new mongoose.Schema({
  title: String,
  description: String,
  songs: [{
    title: String,
    artist: String,
    votes: [mongoose.Schema.Types.ObjectId],
  }],
  isActive: Boolean,
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  type: String,
  category: String,
  artist: String,
  event: {
    date: Date,
    venue: String,
    city: String,
  },
  stock: Number,
  allowPairing: Boolean,
}, { timestamps: true });

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  trackId: String,
  type: String,
  messages: [{
    user: mongoose.Schema.Types.ObjectId,
    username: String,
    content: String,
    isAnonymous: Boolean,
    reactions: [String],
    createdAt: { type: Date, default: Date.now },
  }],
  isActive: Boolean,
}, { timestamps: true });

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get or create models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
    const News = mongoose.models.News || mongoose.model('News', NewsSchema);
    const Poll = mongoose.models.Poll || mongoose.model('Poll', PollSchema);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const ChatRoom = mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);

    // Clear existing data
    await User.deleteMany({});
    await Artist.deleteMany({});
    await News.deleteMany({});
    await Poll.deleteMany({});
    await Product.deleteMany({});
    await ChatRoom.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users with hashed passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        email: 'asmit@estier.com',
        password: hashedPassword,
        username: 'asmit',
        avatar: '/avatars/asmit.png',
        topRappers: ['KRSNA', 'Seedhe Maut', 'Raftaar', 'DIVINE', 'Badshah'],
        city: 'Mumbai',
      },
      {
        email: 'prakhar@estier.com',
        password: hashedPassword,
        username: 'prakhar',
        avatar: '/avatars/prakhar.png',
        topRappers: ['MC Stan', 'Emiway', 'KR$NA', 'Prabh Deep', 'Ikka'],
        city: 'Delhi',
      },
      {
        email: 'rohan@estier.com',
        password: hashedPassword,
        username: 'rohan',
        avatar: '/avatars/rohan.png',
        topRappers: ['Seedhe Maut', 'Prabh Deep', 'Sez on the Beat', 'Frappe Ash', 'Yungsta'],
        city: 'Delhi',
      },
      {
        email: 'seedhemaut@estier.com',
        password: hashedPassword,
        username: 'seedhemaut',
        avatar: '/avatars/seedhemaut.png',
        topRappers: ['Seedhe Maut', 'Prabh Deep', 'KRSNA', 'Sez on the Beat', 'Shah Rule'],
        city: 'Delhi',
      },
      {
        email: 'krsna@estier.com',
        password: hashedPassword,
        username: 'krsna',
        avatar: '/avatars/krsna.png',
        topRappers: ['KRSNA', 'Raftaar', 'Ikka', 'DIVINE', 'KR$NA'],
        city: 'Mumbai',
      },
      {
        email: 'raja@estier.com',
        password: hashedPassword,
        username: 'rajkumar',
        avatar: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=R',
        topRappers: ['DIVINE', 'Naezy', 'MC Altaf', 'D\'Evil', 'Ace'],
        city: 'Mumbai',
      },
      {
        email: 'priya@estier.com',
        password: hashedPassword,
        username: 'priyavibes',
        avatar: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=P',
        topRappers: ['Prabh Deep', 'Seedhe Maut', 'Sez on the Beat', 'Tsumyoki', 'Yungsta'],
        city: 'Delhi',
      },
      {
        email: 'arjun@estier.com',
        password: hashedPassword,
        username: 'arjunbeats',
        avatar: 'https://via.placeholder.com/150/95E1D3/000000?text=A',
        topRappers: ['Brodha V', 'Raftaar', 'KRSNA', 'KR$NA', 'Sikander Kahlon'],
        city: 'Bengaluru',
      },
      {
        email: 'sneha@estier.com',
        password: hashedPassword,
        username: 'snehadhh',
        avatar: 'https://via.placeholder.com/150/F38181/FFFFFF?text=S',
        topRappers: ['MC Stan', 'Emiway', 'Karma', 'Raftaar', 'DIVINE'],
        city: 'Pune',
      },
      {
        email: 'maya@estier.com',
        password: hashedPassword,
        username: 'mayahiphop',
        avatar: 'https://via.placeholder.com/150/FCBAD3/000000?text=M',
        topRappers: ['DIVINE', 'KRSNA', 'Raftaar', 'Badshah', 'Ikka'],
        city: 'Mumbai',
      },
      {
        email: 'kabir@estier.com',
        password: hashedPassword,
        username: 'kabirkulture',
        avatar: 'https://via.placeholder.com/150/FFFFD2/000000?text=K',
        topRappers: ['Prabh Deep', 'Seedhe Maut', 'Sez on the Beat', 'KRSNA', 'Shah Rule'],
        city: 'Delhi',
      },
      {
        email: 'ananya@estier.com',
        password: hashedPassword,
        username: 'ananyaflows',
        avatar: 'https://via.placeholder.com/150/A8D8EA/000000?text=A',
        topRappers: ['MC Stan', 'Emiway', 'Raftaar', 'DIVINE', 'MC Altaf'],
        city: 'Pune',
      },
      {
        email: 'vikram@estier.com',
        password: hashedPassword,
        username: 'vikramlyrics',
        avatar: 'https://via.placeholder.com/150/FFD5CD/000000?text=V',
        topRappers: ['KRSNA', 'KR$NA', 'Raftaar', 'Ikka', 'DIVINE'],
        city: 'Mumbai',
      },
      {
        email: 'ishaan@estier.com',
        password: hashedPassword,
        username: 'ishaancypher',
        avatar: 'https://via.placeholder.com/150/C3AED6/000000?text=I',
        topRappers: ['Brodha V', 'Smokey The Ghost', 'Seedhe Maut', 'Prabh Deep', 'Frappe Ash'],
        city: 'Bengaluru',
      },
      {
        email: 'zara@estier.com',
        password: hashedPassword,
        username: 'zarabeats',
        avatar: 'https://via.placeholder.com/150/8EA7E9/FFFFFF?text=Z',
        topRappers: ['Seedhe Maut', 'Prabh Deep', 'DIVINE', 'KRSNA', 'Naezy'],
        city: 'Delhi',
      },
      {
        email: 'aditya@estier.com',
        password: hashedPassword,
        username: 'adityagully',
        avatar: 'https://via.placeholder.com/150/7286D3/FFFFFF?text=AD',
        topRappers: ['DIVINE', 'Naezy', 'MC Altaf', 'D\'Evil', 'MC Stan'],
        city: 'Mumbai',
      },
      {
        email: 'meera@estier.com',
        password: hashedPassword,
        username: 'meeramusic',
        avatar: 'https://via.placeholder.com/150/FFF5E0/000000?text=M',
        topRappers: ['Prabh Deep', 'Sez on the Beat', 'Tsumyoki', 'Seedhe Maut', 'Yungsta'],
        city: 'Delhi',
      },
    ]);

    console.log(`✓ Created ${users.length} users`);

    // Create artists
    const artists = await Artist.create([
      { name: 'KRSNA', hotScore: 950, bio: 'Lyrical king of Desi Hip-Hop', isEmerging: false },
      { name: 'Seedhe Maut', hotScore: 920, bio: 'Experimental duo pushing boundaries', isEmerging: false },
      { name: 'DIVINE', hotScore: 900, bio: 'Pioneer of Indian Hip-Hop', isEmerging: false },
      { name: 'Raftaar', hotScore: 880, bio: 'Versatile rapper and producer', isEmerging: false },
      { name: 'MC Stan', hotScore: 860, bio: 'Raw street rapper from Pune', isEmerging: false },
      { name: 'Emiway Bantai', hotScore: 840, bio: 'Independent artist with massive fanbase', isEmerging: false },
      { name: 'Prabh Deep', hotScore: 820, bio: 'Conscious rapper from Delhi', isEmerging: false },
      { name: 'Badshah', hotScore: 800, bio: 'Commercial success and chart-topper', isEmerging: false },
      { name: 'Ikka', hotScore: 780, bio: 'Mafia Mundeer veteran', isEmerging: false },
      { name: 'KR$NA', hotScore: 760, bio: 'Technical prowess and wordplay master', isEmerging: false },
      { name: 'Yungsta', hotScore: 450, bio: 'Up and coming from Delhi underground', isEmerging: true },
      { name: 'Sez on the Beat', hotScore: 430, bio: 'Producer turned rapper', isEmerging: true },
      { name: 'Panther', hotScore: 410, bio: 'Gully gang rising star', isEmerging: true },
    ]);

    console.log('✓ Created artists');

    // Create news articles
    const news = await News.create([
      {
        headline: 'KRSNA releases new album with Mass Appeal called "YOURS TRULY"',
        summary: 'The lyrical king drops his most anticipated project yet, featuring international collaborations.',
        category: 'release',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        author: users[0]._id,
      },
      {
        headline: "Seedhe Maut's Encore ABJ called out publicly for being sensitive",
        summary: 'Twitter drama unfolds as Encore ABJ responds to criticism about his recent statements.',
        category: 'drama',
        image: 'https://images.unsplash.com/photo-1598387846155-e5c7b93f491c?w=800',
        author: users[1]._id,
      },
      {
        headline: 'Sez on the Beat says Indian artists lack creativity recently',
        summary: 'The acclaimed producer speaks out on the current state of Desi Hip-Hop production.',
        category: 'interview',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        author: users[0]._id,
      },
      {
        headline: 'Jani vs Panther debate on nationalism',
        summary: 'Two artists clash over the role of nationalism in hip-hop music.',
        category: 'drama',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        author: users[1]._id,
      },
      {
        headline: 'Seedhe Maut announces India tour',
        summary: 'The duo will perform in 15 cities across India starting next month.',
        category: 'tour',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        author: users[0]._id,
      },
      {
        headline: 'MC Stan breaks streaming records',
        summary: 'The Pune rapper becomes the most-streamed Indian hip-hop artist of 2024.',
        category: 'general',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        author: users[1]._id,
      },
    ]);

    console.log('✓ Created news articles');

    // Create polls
    const polls = await Poll.create([
      {
        title: 'Track of the Month - September 2025',
        description: 'Vote for your favorite Desi Hip-Hop track released this month!',
        songs: [
          { title: 'No Cap', artist: 'KRSNA', votes: [] },
          { title: 'Nanchaku', artist: 'Seedhe Maut', votes: [] },
          { title: 'Insaan', artist: 'Prabh Deep', votes: [] },
          { title: 'Kya Baat Ay', artist: 'Harrdy Sandhu', votes: [] },
        ],
        isActive: true,
      },
    ]);

    console.log('✓ Created polls');

    // Create products (tickets and merch)
    const products = await Product.create([
      {
        name: 'Seedhe Maut Live - Mumbai',
        description: 'Experience the energy of Seedhe Maut live in Mumbai!',
        price: 1499,
        type: 'ticket',
        artist: 'Seedhe Maut',
        event: {
          date: new Date('2025-11-15'),
          venue: 'NSCI Dome',
          city: 'Mumbai',
        },
        stock: 500,
        allowPairing: true,
        image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      },
      {
        name: 'DIVINE Concert - Delhi',
        description: 'The pioneer performs his greatest hits in the capital.',
        price: 1999,
        type: 'ticket',
        artist: 'DIVINE',
        event: {
          date: new Date('2025-12-05'),
          venue: 'Jawaharlal Nehru Stadium',
          city: 'Delhi',
        },
        stock: 1000,
        allowPairing: true,
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      },
      {
        name: 'MC Stan Live - Pune',
        description: 'Stan performs in his hometown!',
        price: 999,
        type: 'ticket',
        artist: 'MC Stan',
        event: {
          date: new Date('2025-10-20'),
          venue: 'Shree Shiv Chhatrapati Sports Complex',
          city: 'Pune',
        },
        stock: 800,
        allowPairing: true,
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      },
      {
        name: 'KRSNA Official Hoodie',
        description: 'Premium quality black hoodie with KRSNA branding.',
        price: 1299,
        type: 'merch',
        artist: 'KRSNA',
        category: 'apparel',
        stock: 200,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      },
      {
        name: 'Seedhe Maut T-Shirt',
        description: 'Limited edition tour merchandise.',
        price: 799,
        type: 'merch',
        artist: 'Seedhe Maut',
        category: 'apparel',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      },
      {
        name: 'Estier Cap',
        description: 'Official Estier snapback cap - Purple & Black.',
        price: 599,
        type: 'merch',
        category: 'accessories',
        stock: 300,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
      },
    ]);

    console.log('✓ Created products');

    // Create chat rooms
    const chatRooms = await ChatRoom.create([
      {
        name: 'Global Hip-Hop Chat',
        type: 'global',
        isActive: true,
        messages: [
          {
            user: users[0]._id,
            username: 'asmit',
            content: 'Welcome to Estier! 🔥',
            isAnonymous: false,
            reactions: [],
          },
          {
            user: users[1]._id,
            username: 'prakhar',
            content: 'This platform is fire! 💯',
            isAnonymous: false,
            reactions: [],
          },
        ],
      },
      {
        name: 'KRSNA - No Cap Discussion',
        type: 'track',
        trackId: 'nocap123',
        isActive: true,
        messages: [],
      },
    ]);

    console.log('✓ Created chat rooms');

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Sample credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: asmit@estier.com | Password: password123');
    console.log('Email: prakhar@estier.com | Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
