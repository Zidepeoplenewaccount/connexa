import { useState } from 'react';
import './merch.css';

const PAYSTACK_PLACEHOLDER = 'https://paystack.com/pay/connexa-merch';

const allProducts = [
  {
    id: 1,
    name: 'Connexa Official T-Shirt',
    category: 'Apparel',
    filter: 'tees',
    price: 10000,
    icon: '👕',
    desc: 'The official Connexa 2026 tee. Rep the brand, own the room.',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 2,
    name: 'Connexa Official Face Cap',
    category: 'Accessories',
    filter: 'caps',
    price: 7000,
    icon: '🧢',
    desc: 'Clean, bold, unmistakable. The Connexa cap you need.',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 3,
    name: 'Connexa Drip Pack',
    category: 'Bundle',
    filter: 'packs',
    price: 15000,
    originalPrice: 17000,
    icon: '🎁',
    desc: 'The full fit. Official T-shirt + Face Cap together.',
    packItems: ['Official T-Shirt', 'Face Cap'],
    badge: 'pack',
    cardClass: 'featured',
    priceClass: 'price-orange',
    buyClass: 'buy-orange',
  },
  {
    id: 4,
    name: 'Connexa Builder T-Shirt',
    category: 'Apparel',
    filter: 'tees',
    price: 15000,
    icon: '👕',
    desc: 'For the ones building something real. Limited edition builder colourway.',
    badge: 'new',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 5,
    name: 'Connexa Talent T-Shirt',
    category: 'Apparel',
    filter: 'tees',
    price: 12000,
    icon: '👕',
    desc: 'Designed for the creatives, the skilled, the ones who show up differently.',
    cardClass: '',
    priceClass: '',
    buyClass: '',
  },
  {
    id: 6,
    name: 'Connexa Builder Pack',
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
  {
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
  },
];

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

  const filtered = activeFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.filter === activeFilter);

  function handleBuy(product) {
    window.open(PAYSTACK_PLACEHOLDER, '_blank');
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
                <div className="merch-image-placeholder">
                  <span className="merch-placeholder-icon">{product.icon}</span>
                  <span className="merch-placeholder-text">Image Coming Soon</span>
                </div>

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
                <div className="merch-name">{product.name}</div>
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
                      <span style={{ textDecoration: 'line-through', marginLeft: '8px' }}>
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

      </div>
    </section>
  );
}
