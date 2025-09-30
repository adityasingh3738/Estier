import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    price: Number,
    pairWithStrangers: {
      enabled: Boolean,
      groupSize: {
        type: Number,
        enum: [2, 4],
      },
    },
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paired', 'completed'],
    default: 'pending',
  },
  pairingGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PairingGroup',
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
