import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useCartStore } from '../lib/store';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTicketAlt, FaTshirt, FaUsers } from 'react-icons/fa';
import { format } from 'date-fns';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [pairingPreferences, setPairingPreferences] = useState({});

  const { items, addItem, removeItem, clearCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const filteredProducts =
    filter === 'all' ? products : products.filter((p) => p.type === filter);

  const handleAddToCart = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: product.type,
    });
    toast.success('Added to cart!');
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        pairWithStrangers: pairingPreferences[item.id] || { enabled: false },
      }));

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await api.post('/api/orders', {
        items: orderItems,
        total,
      });

      toast.success('Order placed successfully!');
      clearCart();
      setPairingPreferences({});
      setShowCart(false);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const togglePairing = (itemId, groupSize) => {
    setPairingPreferences({
      ...pairingPreferences,
      [itemId]: {
        enabled: !pairingPreferences[itemId]?.enabled,
        groupSize: groupSize || 2,
      },
    });
  };

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="btn-primary flex items-center space-x-2"
          >
            <FaShoppingCart />
            <span>Cart ({items.length})</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          {['all', 'ticket', 'merch'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-mid-gray text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'ticket' ? 'Tickets' : 'Merch'}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-mid-gray">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    {product.type === 'ticket' ? (
                      <FaTicketAlt className="text-6xl" />
                    ) : (
                      <FaTshirt className="text-6xl" />
                    )}
                  </div>
                )}

                <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {product.type === 'ticket' ? 'TICKET' : 'MERCH'}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              {product.type === 'ticket' && product.event && (
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <div>📅 {format(new Date(product.event.date), 'PPP')}</div>
                  <div>📍 {product.event.venue}, {product.event.city}</div>
                </div>
              )}

              {product.artist && (
                <div className="text-sm text-primary mb-3">🎤 {product.artist}</div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-primary"
                >
                  Add to Cart
                </button>
              </div>

              {product.allowPairing && (
                <div className="mt-3 p-2 bg-mid-gray rounded-lg flex items-center space-x-2 text-xs">
                  <FaUsers className="text-primary" />
                  <span className="text-gray-400">Pairing with strangers available</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-dark-gray border-l border-gray-800 z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center text-gray-500 py-20">Cart is empty</div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="card">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-400">
                              ₹{item.price} × {item.quantity}
                            </p>

                            {item.type === 'ticket' && (
                              <div className="mt-2 space-y-2">
                                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={pairingPreferences[item.id]?.enabled || false}
                                    onChange={() => togglePairing(item.id, 2)}
                                    className="w-4 h-4"
                                  />
                                  <span>Pair with strangers</span>
                                </label>

                                {pairingPreferences[item.id]?.enabled && (
                                  <select
                                    className="input-field text-xs py-1"
                                    value={pairingPreferences[item.id]?.groupSize || 2}
                                    onChange={(e) =>
                                      setPairingPreferences({
                                        ...pairingPreferences,
                                        [item.id]: {
                                          enabled: true,
                                          groupSize: parseInt(e.target.value),
                                        },
                                      })
                                    }
                                  >
                                    <option value={2}>Group of 2</option>
                                    <option value={4}>Group of 4</option>
                                  </select>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <button onClick={handleCheckout} className="btn-primary w-full">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
