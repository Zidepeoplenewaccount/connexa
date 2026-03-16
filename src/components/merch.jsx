import { useState } from 'react';
import './merch.css';
import FaceCap from '../assets/IMG_6719.PNG';
import { initializeMerchOrder } from '../services/api';
import { getAffiliateCode } from '../utils/affiliate';


const PAYSTACK_PLACEHOLDER = 'https://paystack.com/pay/connexa-merch';

const allProducts = [
  {
    id: 1,
    name: 'Connexa Official T-Shirt',
    header: 'Official Connexa Shirt',
    tagline: 'Wear the Movement',
    category: 'Apparel',
    filter: 'tees',
    price: 10000,
    icon: '👕',
    desc: 'Anyone who wants to represent the event. Clean, bold, and easy to wear, it lets you carry the Connexa energy wherever you go. If you believe in connections, opportunities, and big ideas, this shirt is for you.',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 2,
    name: 'Connexa Official Face Cap',
    header: 'Connexa Face Cap',
    tagline: 'Complete the Look',
    category: 'Accessories',
    filter: 'caps',
    price: 7000,
    icon: FaceCap,
    desc: 'Clean, bold, unmistakable. The Connexa cap you need to complete your look and rep the movement wherever you go.',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 3,
    name: 'Connexa Drip Pack',
    header: 'Connexa Drip Pack',
    tagline: 'The Full Fit',
    category: 'Bundle',
    filter: 'packs',
    price: 15000,
    originalPrice: 17000,
    icon: '🎁',
    desc: 'Official T-shirt + Face Cap together. Get the complete Connexa look and save.',
    packItems: ['Official T-Shirt', 'Face Cap'],
    badge: 'pack',
    cardClass: 'featured',
    priceClass: 'price-orange',
    buyClass: 'buy-orange',
  },
  {
    id: 4,
    name: 'Connexa Builder T-Shirt',
    header: 'Builder Shirt',
    tagline: 'Create What\'s Next',
    category: 'Apparel',
    filter: 'tees',
    price: 15000,
    icon: '👕',
    desc: 'The Builder Shirt is for entrepreneurs, founders, and business owners in the room to create opportunities. It represents ambition, action, and the drive to build something meaningful. Wear it if you\'re coming to Connexa to connect, collaborate, and grow.',
    badge: 'new',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 5,
    name: 'Connexa Talent T-Shirt',
    header: 'Talent Shirt',
    tagline: 'Show Up Ready',
    category: 'Apparel',
    filter: 'tees',
    price: 12000,
    icon: '👕',
    desc: 'The Talent Shirt is for professionals and individuals ready to showcase their skills and explore new opportunities. It represents curiosity, learning, and growth. Wear it if you\'re coming to Connexa to meet the people and opportunities that move your career forward.',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 6,
    name: 'Connexa Builder Pack',
    header: 'Builder Pack',
    tagline: 'Build in Style',
    category: 'Bundle',
    filter: 'packs',
    price: 20000,
    originalPrice: 22000,
    icon: '📦',
    desc: 'Builder T-Shirt + Face Cap. For those building in style.',
    packItems: ['Builder T-Shirt', 'Face Cap'],
    badge: 'pack',
    cardClass: 'featured',
    priceClass: 'price-orange',
    buyClass: 'buy-orange',
  },
  {
    id: 7,
    name: 'Connexa Talent Pack',
    header: 'Talent Pack',
    tagline: 'Show Up, Stand Out',
    category: 'Bundle',
    filter: 'packs',
    price: 18000,
    originalPrice: 19000,
    icon: '🎒',
    desc: 'Talent T-Shirt + Face Cap. Show up, stand out.',
    packItems: ['Talent T-Shirt', 'Face Cap'],
    badge: 'pack',
    cardClass: 'featured',
    priceClass: 'price-orange',
    buyClass: 'buy-orange',
  },
];


  {/*
    id: 8,
    name: 'Connect Pass',
    category: 'Access',
    filter: 'pass',
    price: 10000,
    icon: '🪪',
    desc: 'Your physical card pass into the Connexa network. Limited spots available — do not sleep on this.',
    badge: 'limited',
    cardClass: 'limited',
    priceClass: 'price-red',
    buyClass: 'buy-red',
    isLimited: true,
  */}

const filters = [
  { label: 'All', value: 'all' },
  { label: '👕 Tees', value: 'tees' },
  { label: '🧢 Caps', value: 'caps' },
  { label: '📦 Packs', value: 'packs' },
  { label: '🪪 Pass', value: 'pass' },
];

function formatPrice(price) {
  return '₦' + price.toLocaleString('en-NG');
}


export default function Merch() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function openBuyModal(product) {
    setSelectedProduct(product);
    setModalOpen(true);
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    setDeliveryAddress('');
    setError('');
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedProduct(null);
  }

  async function handlePurchase(e) {
    e.preventDefault();
    setError('');

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim() || !deliveryAddress.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const affiliateCode = getAffiliateCode();

      const orderData = {
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        product_name: selectedProduct.name,
        quantity: 1,
        unit_price: selectedProduct.price,
        total_amount: selectedProduct.price,
        delivery_address: deliveryAddress,
        affiliate_code: affiliateCode
      };

      const response = await initializeMerchOrder(orderData);

      if (response.status && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        setError('Order initialization failed. Please try again.');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  const filtered = activeFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.filter === activeFilter);

  function handleBuy(product) {
    openBuyModal(product);
  }

  return (
    <section className="merch section" id="merch">
      <div className="container">

        <div className="merch-header reveal">
          <div className="section-tag">Merch Store</div>
          <h2 className="section-title">
            Wear the <span className="highlight-green">Movement</span>
          </h2>
          <p>
            Official Connexa 2026 merchandise. Limited quantities — order early.
          </p>
        </div>

        <div className="merch-disclaimer">
          <strong>NOTE:</strong> Connexa merchandise is sold exclusively on our official website. 
          Items purchased elsewhere are not endorsed or guaranteed by us.
        </div>

        <div className="merch-filters reveal">
          {filters.map(f => (
            <button
              key={f.value}
              className={`merch-filter${activeFilter === f.value ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="merch-grid">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className={`merch-card${product.cardClass ? ' ' + product.cardClass : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Image / Placeholder */}
              <div className="merch-image">
                {typeof product.icon === 'string' && product.icon.length <= 2 ? (
                  <div className="merch-image-placeholder">
                    <span className="merch-placeholder-icon">{product.icon}</span>
                  </div>
                ) : (
                  <img src={product.icon} className="merch-actual-image" alt={product.name} />
                )}

                {/* Badges */}
                <div className="merch-badges">
                  {product.badge === 'pack' && (
                    <span className="merch-badge merch-badge-pack">Bundle</span>
                  )}
                  {product.badge === 'limited' && (
                    <span className="merch-badge merch-badge-limited">Limited</span>
                  )}
                  {product.badge === 'new' && (
                    <span className="merch-badge merch-badge-new">New</span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="merch-body">
                <div className="merch-category">{product.category}</div>
                
                {/* Header and Tagline */}
                <div className="merch-header-section">
                  <h3 className="merch-header">{product.header}</h3>
                  <p className="merch-tagline">{product.tagline}</p>
                </div>

                <p className="merch-desc">{product.desc}</p>

                {product.packItems && (
                  <div className="merch-pack-items">
                    {product.packItems.map(item => (
                      <span key={item} className="merch-pack-item">✓ {item}</span>
                    ))}
                  </div>
                )}

                <div className="merch-footer">
                  <div className={`merch-price${product.priceClass ? ' ' + product.priceClass : ''}`}>
                    {formatPrice(product.price)}
                    {product.originalPrice && (
                      <span className="merch-price-original">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    className={`merch-buy${product.buyClass ? ' ' + product.buyClass : ''}`}
                    onClick={() => handleBuy(product)}
                  >
                    Buy Now →
                  </button>
                </div>
              </div>

              {/* Limited spots bar for Connect Pass */}
              {product.isLimited && (
                <div className="merch-limited-bar">
                  <div className="merch-limited-label">
                    <span>Availability</span>
                    <span>Limited Spots</span>
                  </div>
                  <div className="merch-limited-track">
                    <div className="merch-limited-fill" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {modalOpen && selectedProduct && (
        <div className="merch-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="merch-modal">
            <button className="merch-modal-close" onClick={closeModal}>×</button>

            <h3 className="merch-modal-title">{selectedProduct.name}</h3>
            <p className="merch-modal-price">₦{selectedProduct.price.toLocaleString()}</p>

            <form className="merch-modal-form" onSubmit={handlePurchase}>
              <div className="merch-input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  className="merch-input"
                  placeholder="Full Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                />
              </div>

              <div className="merch-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="merch-input"
                  placeholder="your@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="merch-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="merch-input"
                  placeholder="+234 XXX XXX XXXX"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="merch-input-group">
                <label>Delivery Address</label>
                <textarea
                  className="merch-input"
                  placeholder="Your delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows="3"
                  required
                />
              </div>

              {error && <div className="merch-modal-error">{error}</div>}

              <button
                type="submit"
                className="merch-modal-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment →'}
              </button>
            </form>
          </div>
        </div>
      )}

      </div>
    </section>
  );
}
