import { useState, useEffect } from 'react';
import './merch.css';
import FaceCap from '../assets/IMG_6719.PNG';
import { initializeMerchOrder } from '../services/api';
import { getAffiliateCode } from '../utils/affiliate';
import { validateTicketId } from '../services/api';

const allProducts = [
  {
    id: 1,
    name: 'Connexa Official T-Shirt',
    header: 'Official Connexa Shirt',
    tagline: 'Wear the Movement',
    category: 'Apparel',
    filter: 'tees',
    price: 10000,
    desc: 'Anyone who wants to represent the event. Clean, bold, and easy to wear, it lets you carry the Connexa energy wherever you go.',
    hasSize: true,
    colors: [
      { name: 'Black', value: 'black', image: '👕' }, // Replace with actual image path
      { name: 'White', value: 'white', image: '👕' }, // Replace with actual image path
    ],
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
    desc: 'Clean, bold, unmistakable. The Connexa cap you need to complete your look.',
    hasSize: false,
    colors: [
      { name: 'Black', value: 'black', image: FaceCap },
      { name: 'White', value: 'white', image: FaceCap }, // Replace with white cap image
    ],
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
    desc: 'Official T-shirt + Face Cap together. Get the complete Connexa look and save.',
    isBundle: true,
    bundleItems: [
      {
        name: 'Official T-Shirt',
        hasSize: true,
        colors: [
          { name: 'Black', value: 'black', image: '👕' },
          { name: 'White', value: 'white', image: '👕' },
        ],
      },
      {
        name: 'Face Cap',
        hasSize: false,
        colors: [
          { name: 'Black', value: 'black', image: FaceCap },
          { name: 'White', value: 'white', image: FaceCap },
        ],
      },
    ],
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
    desc: 'For entrepreneurs, founders, and business owners. It represents ambition, action, and the drive to build something meaningful.',
    hasSize: true,
    colors: [
      { name: 'Black', value: 'black', image: '👕' },
      { name: 'White', value: 'white', image: '👕' },
    ],
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
    desc: 'For professionals ready to showcase their skills. It represents curiosity, learning, and growth.',
    hasSize: true,
    colors: [
      { name: 'Black', value: 'black', image: '👕' },
      { name: 'White', value: 'white', image: '👕' },
    ],
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
    desc: 'Builder T-Shirt + Face Cap. For those building in style.',
    isBundle: true,
    bundleItems: [
      {
        name: 'Builder T-Shirt',
        hasSize: true,
        colors: [
          { name: 'Black', value: 'black', image: '👕' },
          { name: 'White', value: 'white', image: '👕' },
        ],
      },
      {
        name: 'Face Cap',
        hasSize: false,
        colors: [
          { name: 'Black', value: 'black', image: FaceCap },
          { name: 'White', value: 'white', image: FaceCap },
        ],
      },
    ],
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
    desc: 'Talent T-Shirt + Face Cap. Show up, stand out.',
    isBundle: true,
    bundleItems: [
      {
        name: 'Talent T-Shirt',
        hasSize: true,
        colors: [
          { name: 'Black', value: 'black', image: '👕' },
          { name: 'White', value: 'white', image: '👕' },
        ],
      },
      {
        name: 'Face Cap',
        hasSize: false,
        colors: [
          { name: 'Black', value: 'black', image: FaceCap },
          { name: 'White', value: 'white', image: FaceCap },
        ],
      },
    ],
    badge: 'pack',
    cardClass: 'featured',
    priceClass: 'price-orange',
    buyClass: 'buy-orange',
  },
];

const filters = [
  { label: 'All', value: 'all' },
  { label: '👕 Tees', value: 'tees' },
  { label: '🧢 Caps', value: 'caps' },
  { label: '📦 Packs', value: 'packs' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

function formatPrice(price) {
  return '₦' + price.toLocaleString('en-NG');
}

export default function Merch() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Card color selection state (for preview)
  const [cardColorSelections, setCardColorSelections] = useState({});
  
  // Checkout form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [bundleSelections, setBundleSelections] = useState([]);
  
  // Ticket validation
  const [ticketValidating, setTicketValidating] = useState(false);
  const [ticketValid, setTicketValid] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize card color selections
  useEffect(() => {
    const initialSelections = {};
    allProducts.forEach(product => {
      if (product.isBundle) {
        // For bundles, store first color of first item's first color
        initialSelections[product.id] = product.bundleItems[0].colors[0].value;
      } else {
        initialSelections[product.id] = product.colors[0].value;
      }
    });
    setCardColorSelections(initialSelections);
  }, []);

  function handleCardColorChange(productId, colorValue) {
    setCardColorSelections(prev => ({
      ...prev,
      [productId]: colorValue
    }));
  }

  function getCurrentImage(product) {
    const selectedColorValue = cardColorSelections[product.id];
    
    if (product.isBundle) {
      // For bundles, show first item's selected color image
      const firstItem = product.bundleItems[0];
      const color = firstItem.colors.find(c => c.value === selectedColorValue);
      return color ? color.image : firstItem.colors[0].image;
    } else {
      const color = product.colors.find(c => c.value === selectedColorValue);
      return color ? color.image : product.colors[0].image;
    }
  }

  async function validateTicket(id) {
    if (!id || id.length < 8) {
      setTicketValid(false);
      setTicketData(null);
      return;
    }

    setTicketValidating(true);
    setError('');

    try {
      const data = await validateTicketId(id);
      setTicketValid(true);
      setTicketData(data);
      // Prefill buyer name
      setBuyerName(data.attendee_name);
    } catch (err) {
      setTicketValid(false);
      setTicketData(null);
      setError('Invalid ticket ID. You must have a valid Connexa ticket to purchase merch.');
    } finally {
      setTicketValidating(false);
    }
  }

  function handleTicketIdChange(value) {
    setTicketId(value);
    setTicketValid(false);
    setTicketData(null);
    
    clearTimeout(window.ticketValidationTimeout);
    window.ticketValidationTimeout = setTimeout(() => {
      validateTicket(value);
    }, 500);
  }

  function openBuyModal(product) {
    setSelectedProduct(product);
    setModalOpen(true);
    
    // Reset form
    setBuyerName('');
    setBuyerPhone('');
    setTicketId('');
    setDeliveryAddress('');
    setError('');
    setTicketValid(false);
    setTicketData(null);
    
    if (product.isBundle) {
      // Initialize bundle selections
      setBundleSelections(product.bundleItems.map(item => ({
        name: item.name,
        color: item.colors[0].value,
        size: item.hasSize ? 'M' : null
      })));
    } else {
      setSelectedColor(product.colors[0].value);
      setSelectedSize(product.hasSize ? 'M' : '');
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedProduct(null);
  }

  function handleBundleItemChange(index, field, value) {
    const newSelections = [...bundleSelections];
    newSelections[index][field] = value;
    setBundleSelections(newSelections);
  }

  async function handlePurchase(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!ticketValid) {
      setError('You must have a valid Connexa ticket to purchase merch');
      return;
    }

    if (!buyerName.trim() || !buyerPhone.trim() || !deliveryAddress.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (selectedProduct.isBundle) {
      const allSelected = bundleSelections.every(item => 
        item.color && (!item.hasSize || item.size)
      );
      if (!allSelected) {
        setError('Please select color and size for all items');
        return;
      }
    } else {
      if (!selectedColor) {
        setError('Please select a color');
        return;
      }
      if (selectedProduct.hasSize && !selectedSize) {
        setError('Please select a size');
        return;
      }
    }

    setLoading(true);

    try {
      const affiliateCode = getAffiliateCode();

      // Build product details
      let productDetails = selectedProduct.name;
      if (selectedProduct.isBundle) {
        const itemDetails = bundleSelections.map(item => 
          `${item.name} (${item.color}${item.size ? `, ${item.size}` : ''})`
        ).join(', ');
        productDetails += ` - ${itemDetails}`;
      } else {
        productDetails += ` (${selectedColor}${selectedSize ? `, ${selectedSize}` : ''})`;
      }

      const orderData = {
        buyer_name: buyerName,
        buyer_email: ticketData.email,
        buyer_phone: buyerPhone,
        product_name: productDetails,
        product_details: orderData.product_details,
        quantity: 1,
        unit_price: selectedProduct.price,
        total_amount: selectedProduct.price,
        delivery_address: deliveryAddress,
        ticket_id: ticketId,
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

  return (
    <section className="merch section" id="merch">
      <div className="container">
        <div className="merch-header reveal">
          <div className="section-tag">Merch Store</div>
          <h2 className="section-title">
            Wear the <span className="highlight-green">Movement</span>
          </h2>
          <p>Official Connexa 2026 merchandise. Limited quantities — order early.</p>
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
          {filtered.map((product, i) => {
            const currentImage = getCurrentImage(product);
            
            return (
              <div
                key={product.id}
                className={`merch-card${product.cardClass ? ' ' + product.cardClass : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Image / Placeholder */}
                <div className="merch-image">
                  {typeof currentImage === 'string' && currentImage.length <= 2 ? (
                    <div className="merch-image-placeholder">
                      <span className="merch-placeholder-icon">{currentImage}</span>
                    </div>
                  ) : (
                    <img src={currentImage} className="merch-actual-image" alt={product.name} />
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

                {/* Color Selector on Card */}
                <div className="merch-color-selector">
                  {product.isBundle ? (
                    product.bundleItems[0].colors.map(color => (
                      <button
                        key={color.value}
                        className={`merch-color-swatch ${cardColorSelections[product.id] === color.value ? 'active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardColorChange(product.id, color.value);
                        }}
                        title={color.name}
                      />
                    ))
                  ) : (
                    product.colors.map(color => (
                      <button
                        key={color.value}
                        className={`merch-color-swatch ${cardColorSelections[product.id] === color.value ? 'active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardColorChange(product.id, color.value);
                        }}
                        title={color.name}
                      />
                    ))
                  )}
                </div>

                {/* Body */}
                <div className="merch-body">
                  <div className="merch-category">{product.category}</div>
                  
                  <div className="merch-header-section">
                    <h3 className="merch-header">{product.header}</h3>
                    <p className="merch-tagline">{product.tagline}</p>
                  </div>

                  <p className="merch-desc">{product.desc}</p>

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
                      onClick={() => openBuyModal(product)}
                    >
                      Buy Now →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CHECKOUT MODAL */}
        {modalOpen && selectedProduct && (
          <div className="merch-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="merch-modal">
              <button className="merch-modal-close" onClick={closeModal}>×</button>

              <h3 className="merch-modal-title">{selectedProduct.name}</h3>
              <p className="merch-modal-price">₦{selectedProduct.price.toLocaleString()}</p>

              <form className="merch-modal-form" onSubmit={handlePurchase}>
                
                {/* TICKET ID - REQUIRED */}
                <div className="merch-input-group">
                  <label>Ticket ID * <small>(You must have a Connexa ticket)</small></label>
                  <input
                    type="text"
                    className="merch-input"
                    placeholder="e.g., CNX2026-ABC123"
                    value={ticketId}
                    onChange={(e) => handleTicketIdChange(e.target.value)}
                    required
                  />
                  {ticketValidating && (
                    <small className="merch-validating">Validating ticket...</small>
                  )}
                  {ticketValid && ticketData && (
                    <div className="merch-valid-badge">
                      ✓ Valid {ticketData.ticket_type} - {ticketData.attendee_name}
                    </div>
                  )}
                </div>

                {/* COLOR & SIZE SELECTION */}
                {selectedProduct.isBundle ? (
                  <div className="merch-bundle-selections">
                    <label>Select Color & Size for Each Item *</label>
                    {selectedProduct.bundleItems.map((item, index) => (
                      <div key={index} className="merch-bundle-item">
                        <div className="merch-bundle-item-name">{item.name}</div>
                        
                        {/* Color */}
                        <div className="merch-color-options">
                          {item.colors.map(color => (
                            <label key={color.value} className="merch-color-option">
                              <input
                                type="radio"
                                name={`bundle-${index}-color`}
                                value={color.value}
                                checked={bundleSelections[index]?.color === color.value}
                                onChange={(e) => handleBundleItemChange(index, 'color', e.target.value)}
                                required
                              />
                              <span className="merch-color-circle" style={{ backgroundColor: color.value }} />
                              <span>{color.name}</span>
                            </label>
                          ))}
                        </div>

                        {/* Size if applicable */}
                        {item.hasSize && (
                          <div className="merch-size-options">
                            {SIZES.map(size => (
                              <label key={size} className="merch-size-option">
                                <input
                                  type="radio"
                                  name={`bundle-${index}-size`}
                                  value={size}
                                  checked={bundleSelections[index]?.size === size}
                                  onChange={(e) => handleBundleItemChange(index, 'size', e.target.value)}
                                  required
                                />
                                <span>{size}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Single Product Color */}
                    <div className="merch-input-group">
                      <label>Color *</label>
                      <div className="merch-color-options">
                        {selectedProduct.colors.map(color => (
                          <label key={color.value} className="merch-color-option">
                            <input
                              type="radio"
                              name="color"
                              value={color.value}
                              checked={selectedColor === color.value}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              required
                            />
                            <span className="merch-color-circle" style={{ backgroundColor: color.value }} />
                            <span>{color.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Single Product Size */}
                    {selectedProduct.hasSize && (
                      <div className="merch-input-group">
                        <label>Size *</label>
                        <div className="merch-size-options">
                          {SIZES.map(size => (
                            <label key={size} className="merch-size-option">
                              <input
                                type="radio"
                                name="size"
                                value={size}
                                checked={selectedSize === size}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                required
                              />
                              <span>{size}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Name (prefilled from ticket) */}
                <div className="merch-input-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    className="merch-input"
                    placeholder="Full Name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    disabled={ticketValid}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="merch-input-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    className="merch-input"
                    placeholder="+234 XXX XXX XXXX"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Delivery Address */}
                <div className="merch-input-group">
                  <label>Delivery Address *</label>
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
                  disabled={loading || !ticketValid}
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