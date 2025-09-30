import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  bio: String,
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  hotScore: {
    type: Number,
    default: 0,
  },
  isEmerging: {
    type: Boolean,
    default: false,
  },
  spotifyUrl: String,
  instagramUrl: String,
}, { timestamps: true });

export default mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
