import { useState, useEffect, useRef } from 'react';
import { FaTicketAlt, FaLightbulb, FaGift, FaUsers } from 'react-icons/fa';
import './Tickets.css';

const SKILL_OPTIONS = [
  'Software Developer',
  'UI/UX Designer',
  'Product Manager',
  'Data Analyst',
  'Digital Marketer',
  'Content Creator',
  'Graphic Designer',
  'Project Manager',
  'Sales / Business Development',
  'Customer Support',
  'Virtual Assistant',
  'Copywriter',
  'Video Editor',
  'Social Media Manager',
  'Accountant / Finance',
  'HR / Recruiter',
  'Photographer',
  'Fashion Designer',
  'Business Owner',
  'Student',
  'Web Developer',
  'Mobile App Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'AI / Machine Learning Engineer',
  'Blockchain Developer',
  'QA / Tester',
  'Technical Writer',
  'SEO Specialist',
  'Email Marketer',
  'Brand Strategist',
  'Motion Designer',
  'Animator',
  'Music Producer',
  'Event Planner',
  'Interior Designer',
  'Real Estate Agent',
  'Lawyer',
  'Doctor / Health Professional',
  'Teacher / Tutor',
  'Chef / Caterer',
  'Fitness Trainer',
  'Logistics / Supply Chain',
  'Entrepreneur',
  'Other',
];

function SkillDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const dropdownRef = useRef(null);

  const isOther = value === 'Other' || (value && !SKILL_OPTIONS.slice(0, -1).includes(value));

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = SKILL_OPTIONS.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(opt) {
    if (opt === 'Other') {
      onChange('Other');
      setCustomSkill('');
    } else {
      onChange(opt);
    }
    setIsOpen(false);
    setSearch('');
  }

  function handleCustomChange(e) {
    const val = e.target.value;
    setCustomSkill(val);
    onChange(val || 'Other');
  }

  const displayValue = isOther && value !== 'Other' ? value : (SKILL_OPTIONS.includes(value) ? value : '');

  return (
    <div className="skill-dropdown" ref={dropdownRef}>
      <div
        className={`skill-dropdown-trigger ticket-input ${isOpen ? 'skill-dropdown-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={displayValue || value === 'Other' ? 'skill-dropdown-value' : 'skill-dropdown-placeholder'}>
          {displayValue || (value === 'Other' ? 'Other (custom)' : 'What is your role or primary skill?')}
        </span>
        <svg className={`skill-dropdown-arrow ${isOpen ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {isOpen && (
        <div className="skill-dropdown-menu">
          <input
            type="text"
            className="skill-dropdown-search"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="skill-dropdown-options">
            {filtered.length > 0 ? filtered.map(opt => (
              <div
                key={opt}
                className={`skill-dropdown-option ${opt === value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            )) : (
              <div className="skill-dropdown-empty">No matches found</div>
            )}
          </div>
        </div>
      )}

      {(value === 'Other' || (isOther && value)) && (
        <input
          type="text"
          className="ticket-input skill-custom-input"
          placeholder="Type your skill or role..."
          value={isOther && value !== 'Other' ? value : customSkill}
          onChange={handleCustomChange}
        />
      )}
    </div>
  );
}
const CONNEXER_OPTIONS = [
  { group: 'Connexers', items: [
    { value: 'Joshua Oluwadepo', label: 'Joshua Oluwadepo — Talent Connexer' },
    { value: 'Rt. Hon Itunuoluwa Maria Soniregun', label: 'Rt. Hon Itunuoluwa — Talent Connexer' },
    { value: 'Richard Essangabasi', label: 'Richard Essangabasi — Talent & Business Connexer' },
  ]},
  { group: 'Playgrounders', items: [
    { value: 'Barr. Mosunmoluwa David-Gbemisola', label: 'Mosunmoluwa — Business Playgrounder' },
    { value: 'Omobolanle Adigun (The Vibe Queen)', label: 'Omobolanle (The Vibe Queen) — Talent Playgrounder' },
    { value: 'Olalekan Asani', label: 'Olalekan Asani — Business Playgrounder' },
    { value: 'David Ogooluwa (Dotify)', label: 'Dotify — Talent Playgrounder' },
    { value: 'Oluwatomi Adeife', label: 'Oluwatomi Adeife — Talent & Business' },
  ]},
];

function ConnexerDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allItems = CONNEXER_OPTIONS.flatMap(g => g.items);
  const selectedLabel = allItems.find(i => i.value === value)?.label || '';

  function handleSelect(val) {
    onChange(val);
    setIsOpen(false);
  }

  return (
    <div className="skill-dropdown" ref={dropdownRef}>
      <div
        className={`skill-dropdown-trigger ticket-input ${isOpen ? 'skill-dropdown-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'skill-dropdown-value' : 'skill-dropdown-placeholder'}>
          {selectedLabel || 'Select a Connexer or Playgrounder'}
        </span>
        <svg className={`skill-dropdown-arrow ${isOpen ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {isOpen && (
        <div className="skill-dropdown-menu">
          <div className="skill-dropdown-options">
            {CONNEXER_OPTIONS.map(group => (
              <div key={group.group}>
                <div className="connexer-dropdown-group-label">{group.group}</div>
                {group.items.map(item => (
                  <div
                    key={item.value}
                    className={`skill-dropdown-option ${item.value === value ? 'selected' : ''}`}
                    onClick={() => handleSelect(item.value)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { initializePayment, validateTicketId, validateDiscountCode, validateSpeakerCode, createFreeOrder, findTicketsByEmail } from '../services/api';
import { getAffiliateCode } from '../utils/affiliate';
import { getSpeakerCode } from '../utils/speaker';
import { isDiscountActive, calculateTicketPrice, getDiscountPercentage } from '../utils/discount';
import { getUserFriendlyError, logTechnicalError } from '../utils/errorMessages';


const tickets = [
  {
    id: 1,
    type: 'general',
    passType: 'individual',
    icon: <FaTicketAlt size={20} />,
    iconClass: 'ticket-icon-white',
    label: 'Open Access',
    name: 'Marketplace Pass',
    subtitle: 'Access the Connexa Showcase Floor, shop from 100+ vendors, discover new brands, and experience the energy of the Opportunity Playground.',
    price: 3000,
    available: 52,
    features: [
      'Access to outdoor vendor marketplace',
      'Shop from 100+ vendors and businesses',
      'Discover and support new brands on the spot',
      'Opportunity to meet vendors and access real opportunities',
      'Experience the energy of the Opportunity Playground',
    ],
    bestFor: 'Anyone who wants to shop with vendors and feel the energy of the Opportunity Playground.',
    cta: 'Get Marketplace Pass',
    ctaClass: '',
    dotColor: 'rgba(255,255,255,0.5)',
    hideLowStockBadge: true,
  },
  {
    id: 2,
    type: 'regular',
    passType: 'individual',
    icon: '🎟️',
    iconClass: 'ticket-icon-white',
    label: 'General Attendees',
    name: 'Talent Pass — Regular',
    subtitle: 'Learn, connect, and discover opportunities',
    price: 5000,
    available: 2700,  // ADD THIS
    features: [
      'Access to speaker sessions and panels',
      'Exposure to businesses, vendors, and hiring brands',
      'Meet professionals and creatives for real opportunities',
      'Insight into the future of flexible work',
      'Entry into a high-energy, opportunity-driven environment',
    ],
    bestFor: 'Students, freelancers, professionals, and job seekers.',
    cta: 'Get Talent Pass',
    ctaClass: '',
    dotColor: 'rgba(255,255,255,0.7)',
  },
  {
    id: 4,
    type: 'vip',
    passType: 'individual',
    icon: '⭐',
    iconClass: 'ticket-icon-gradient',
    label: 'Premium Individuals',
    name: 'Talent Pass — VIP',
    subtitle: 'Premium access, priority opportunity circles, and recognition',
    price: 10000,
    available: 500,  // ADD THIS
    badge: 'VIP',
    badgeClass: '',
    features: [
      'Priority seating and VIP event access',
      'Exclusive access to speakers and partners',
      'Access to VIP-only areas and sessions',
      'Eligibility for Individual Awards & Recognition',
      'Premium event experience',
      'Includes connectors pass',
    ],
    bestFor: 'Professionals who want visibility, status, and recognition.',
    cta: 'Get Talent VIP Pass',
    ctaClass: 'cta-orange',
    dotColor: 'var(--orange)',
  },
  {
    id: 3,
    type: 'connectors',
    passType: 'individual',
    icon: '🔗',
    iconClass: 'ticket-icon-blue',
    label: 'Strategic Opportunities',
    name: 'Connectors Pass',
    subtitle: 'Turn conversations into real opportunities',
    price: 5000,
    available: 30,  // ADD THIS
    features: [
      'Must purchase General access/Individual Regular ticket',
      'Gain entry to curated opportunity sessions',
      'Structured introductions to business owners and speakers',
      'Participation in connection circles',
      'Access to all regular pass benefits',
    ],
    bestFor: 'Professionals focused on strategic connections and partnerships.',
    cta: 'Get Connectors Pass',
    ctaClass: 'cta-blue',
    dotColor: 'var(--blue)',
  },
  {
    id: 5,
    type: 'growth',
    passType: 'business',
    icon: '📈',
    iconClass: 'ticket-icon-green',
    label: 'Business Owners',
    name: 'Business Owner Pass',
    subtitle: "Learn what works. Fix what's not working. Grow faster. (Only 100 spots)",
    price: 30000,
    available: 500,  // ADD THIS
    features: [
      'Access to all speaker sessions and panels',
      'Practical insights for scaling, operations, and sales',
      'Peer connection with other business owners',
      'Access to roaming business advisors',
      'Priority seating and business owner recognition',
      'Full focus on learning and growth strategy',
    ],
    bestFor: 'Founders who want clarity, structure, and growth direction.',
    cta: 'Get Business Pass',
    ctaClass: 'cta-green',
    dotColor: 'var(--green)',
  },
  {
    id: 6,
    type: 'showcase',
    passType: 'vendor',
    icon: <FaLightbulb size={20} />,
    iconClass: 'ticket-icon-blue',
    label: 'Brand Visibility',
    name: 'Showcase Vendor Pass',
    subtitle: 'Build visibility, trust, and partnerships — bring your own booth',
    price: 110000,
    available: 35,
    features: [
      'Bring your own booth setup',
      'Dedicated space to showcase your brand, app, or service',
      'Brand awareness in front of founders, talents, and decision-makers',
      'Opportunity to attract users, partners, and collaborators',
      'Access to business advisors and speaker sessions',
      'Eligibility for Brand Recognition Award',
      'Brand positioning without sales pressure',
      'Maximum of 2 staff members per booth',
      'Staff access tickets are included in your booth package',
      'Allowed booth sizes: 2m × 2m and 2m x 3m. Only these specified booth sizes are permitted',
      'Limited to one booth per brand'
    ],
    bestFor: 'Tech startups, service brands, platforms, and businesses focused on visibility.',
    cta: 'Get Showcase Pass',
    notice: 'Not suitable for large physical product displays',
    ctaClass: 'cta-blue',
    dotColor: 'var(--blue)',
  },
  {
    id: 7,
    type: 'vendor',
    passType: 'vendor',
    icon: '🏪',
    iconClass: 'ticket-icon-orange',
    label: 'Direct Sales',
    name: 'Market Vendor Pass',
    subtitle: 'Sell directly to a high-intent audience — tent provided',
    price: 120000,
    available: 52,
    features: [
      'Tent and booth setup provided by us',
      'Physical marketplace presence with real buyers',
      'Direct sales, lead capture, and brand exposure',
      'Access to customers actively looking to buy',
      'Eligibility for Brand Recognition Award',
      'Business advisory support during the event',
      'High foot traffic, visibility, and real revenue opportunity',
    ],
    bestFor: 'Businesses ready to sell, test products, and close deals on the spot.',
    cta: 'Get Vendor Pass',
    ctaClass: 'cta-orange',
    dotColor: 'var(--orange)',
  },
  {
    id: 8,
    type: 'vip-partner',
    passType: 'business',
    icon: '👑',
    iconClass: 'ticket-icon-rainbow',
    label: 'Sell • Showcase • Partner',
    name: 'VIP Partner Pass',
    subtitle: 'Maximum exposure. Maximum access. Maximum influence.',
    price: 500000,
    badge: 'PREMIUM',
    badgeClass: 'badge-red',
    featured: true,
    features: [
      'Prime booth placement (sell or showcase)',
      'Partner-level brand recognition at the event',
      'On-stage mentions and media visibility',
      'Priority access to business advisors and partners',
      'VIP seating and premium brand positioning',
      'Opportunity to support via cash or in-kind contributions',
      'Maximum visibility and strategic partnerships',
    ],
    bestFor: 'Serious brands looking for visibility, influence, and long-term partnerships.',
    cta: 'Become a VIP Partner',
    ctaClass: 'cta-gradient',
    dotColor: 'var(--red)',
  },
];

const LOW_STOCK_THRESHOLD = 100;

// Calculate group discount for individual passes
function calculateDiscount(quantity) {
  if (quantity === 5) return 5000;
  if (quantity >= 2 && quantity < 5) return 2000;
  return 0;
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export default function Tickets() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Individual pass state
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState([{ name: '', email: '', phone: '', role_or_skill: '' }]);
  
  // Business pass state
  const [businessName, setBusinessName] = useState('');
  const [repName, setRepName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  // Add these to your existing state declarations
  const [vendorData, setVendorData] = useState({
    fullName: '',
    businessName: '',
    whatsapp: '',
    email: '',
    instagramWebsite: '',
    category: '',
    needElectricity: 'no',
    electricityAppliances: '',
    supportAssistant: 'no',
  supportQuantity: 1
  });
  
  // Connectors Pass state
  const [connectorsTicketId, setConnectorsTicketId] = useState('');
  const [connectorsValidating, setConnectorsValidating] = useState(false);
  const [connectorsTicketValid, setConnectorsTicketValid] = useState(false);
  const [connectorsTicketData, setConnectorsTicketData] = useState(null);
  const [connectorsLookupEmail, setConnectorsLookupEmail] = useState('');
  const [connectorsLookupLoading, setConnectorsLookupLoading] = useState(false);
  const [connectorsLookupResults, setConnectorsLookupResults] = useState([]);
  const [connectorsLookupError, setConnectorsLookupError] = useState('');
  const [connectorsPreferredConnexer, setConnectorsPreferredConnexer] = useState('');

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [discountValidating, setDiscountValidating] = useState(false);
  const [discountValid, setDiscountValid] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [validatedCodeType, setValidatedCodeType] = useState(null);

  // Speaker code state (auto-detected from URL ?connexer=SPK-XXX)
  const [speakerCode, setSpeakerCode] = useState(null);
  const [speakerData, setSpeakerData] = useState(null);

  useEffect(() => {
    const code = getSpeakerCode();
    if (code) {
      setSpeakerCode(code);
      validateSpeakerCode(code, 10000).then(data => {
        if (data.valid) setSpeakerData(data);
      }).catch(() => {});
    }
  }, []);


  
  // Check if discount is active
  const discountActive = isDiscountActive();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  async function validateDiscount(code, amount) {
    if (!code || code.length < 3) {
      setDiscountValid(false);
      setDiscountData(null);
      setDiscountError('');
      setValidatedCodeType(null);
      return;
    }

    setDiscountValidating(true);
    setDiscountError('');

    try {
      const userEmail = selectedTicket.passType === 'individual' 
        ? attendees[0]?.email 
        : selectedTicket.passType === 'vendor' 
          ? vendorData.email 
          : businessEmail;

      const normalizedUserEmail = normalizeEmail(userEmail);
      if (!normalizedUserEmail) {
        setDiscountError('Please enter your email first to validate the discount code');
        setDiscountValidating(false);
        return;
      }

      if (!isValidEmail(normalizedUserEmail)) {
        setDiscountError('Please enter a valid email first');
        setDiscountValidating(false);
        return;
      }

      // Try connexer code first so speaker commissions are preserved even when the
      // same code is mirrored in admin discount-codes.
      let data;
      let isConnexerCode = false;
      let codeType = null;
      try {
        const speakerResult = await validateSpeakerCode(code, amount);
        if (speakerResult && speakerResult.valid) {
          data = speakerResult;
          isConnexerCode = true;
          codeType = 'connexer';
        } else {
          data = null;
        }
      } catch {
        data = null;
      }

      // Fall back to regular admin discount code
      if (!data || !data.valid) {
        try {
          data = await validateDiscountCode(
            code,
            normalizedUserEmail,
            amount,
            'tickets',
            selectedTicket.name
          );
          if (data && data.valid) {
            codeType = 'discount';
          }
        } catch {
          // neither worked
        }
      }
      
      if (data && data.valid) {
        setDiscountValid(true);
        setDiscountData(data);
        setDiscountError('');
        setValidatedCodeType(codeType);
        if (isConnexerCode) {
          setSpeakerCode(code.trim());
          setSpeakerData(data);
        }
      } else {
        setDiscountValid(false);
        setDiscountData(null);
        setDiscountError(data?.message || 'Invalid discount code');
        setValidatedCodeType(null);
      }
    } catch (err) {
      setDiscountValid(false);
      setDiscountData(null);
      setDiscountError('Invalid discount code');
      setValidatedCodeType(null);
    } finally {
      setDiscountValidating(false);
    }
  }


  // Debounced discount validation
  function handleDiscountCodeChange(value) {
    setDiscountCode(value);
    setDiscountValid(false);
    setDiscountData(null);
    setDiscountError('');
    setValidatedCodeType(null);
    
    clearTimeout(window.discountValidationTimeout);
    
    if (value.length >= 3) {
      window.discountValidationTimeout = setTimeout(() => {
        // Calculate amount before discount code
        let amount = 0;
        
        if (selectedTicket.passType === 'individual') {
          const ticketPrice = calculateTicketPrice(selectedTicket.name, selectedTicket.price);
          const baseAmount = ticketPrice * quantity;
          const groupDiscount = selectedTicket.name === 'Marketplace Pass' ? 0 : calculateDiscount(quantity);
          amount = baseAmount - groupDiscount;
        } else if (selectedTicket.passType === 'vendor') {
          const ticketPrice = calculateTicketPrice(selectedTicket.name, selectedTicket.price);
          amount = ticketPrice;
          if (vendorData.needElectricity === 'yes') amount += 20000;
          if (vendorData.supportAssistant === 'zidepeople') amount += (vendorData.supportQuantity * 10000);
        } else {
          amount = calculateTicketPrice(selectedTicket.name, selectedTicket.price);
        }
        
        validateDiscount(value, amount);
      }, 500);
    }
  }


  function openModal(ticket) {
    setSelectedTicket(ticket);
    setModalOpen(true);
    setError('');
    document.body.style.overflow = 'hidden';

    // Reset discount code
    setDiscountCode('');
    setDiscountValid(false);
    setDiscountData(null);
    setDiscountError('');
    setValidatedCodeType(null);
    
    // Reset state based on pass type
    if (ticket.passType === 'individual') {
      setQuantity(1);
      setAttendees([{ name: '', email: '', phone: '', role_or_skill: '' }]);

      if (ticket.type === 'connectors') {
        setConnectorsTicketId('');
        setConnectorsValidating(false);
        setConnectorsTicketValid(false);
        setConnectorsTicketData(null);
        setConnectorsLookupEmail('');
        setConnectorsLookupLoading(false);
        setConnectorsLookupResults([]);
        setConnectorsLookupError('');
      }
    } else if (ticket.passType === 'vendor') {
      setVendorData({
        fullName: '',
        businessName: '',
        whatsapp: '',
        email: '',
        instagramWebsite: '',
        category: '',
        needElectricity: 'no',
        electricityAppliances: '',
        supportAssistant: 'no',
        supportQuantity: 1
      });
    } else {
      setBusinessName('');
      setRepName('');
      setBusinessEmail('');
      setBusinessPhone('');
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedTicket(null);
    document.body.style.overflow = '';
  }

  function handleQuantityChange(newQuantity) {
    setQuantity(newQuantity);
    const newAttendees = Array(newQuantity).fill(null).map((_, i) => 
      attendees[i] || { name: '', email: '', phone: '', role_or_skill: '' }
    );
    setAttendees(newAttendees);
  }

  function handleAttendeeChange(index, field, value) {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  }

  // Validate Connectors Pass base ticket
  async function validateConnectorsTicket(ticketId) {
    if (!ticketId || ticketId.length < 8) {
      setConnectorsTicketValid(false);
      setConnectorsTicketData(null);
      return;
    }

    setConnectorsValidating(true);
    setError('');

    try {
      const data = await validateTicketId(ticketId);
      
      // Accept both current and legacy names for regular/base tickets
      const validTypes = [
        'Marketplace Pass',
        'Talent Pass — Regular',
        'Individual Pass — Regular',
        'General Access Ticket',
      ];
      
      if (validTypes.includes(data.ticket_type)) {
        setConnectorsTicketValid(true);
        setConnectorsTicketData(data);
        // Pre-fill first attendee with validated ticket data
        setAttendees([{ name: data.attendee_name, email: data.email, phone: '' }]);
      } else {
        setConnectorsTicketValid(false);
        setConnectorsTicketData(null);
        setError('Connectors Pass requires a Marketplace or Individual Regular ticket');
      }
    } catch (err) {
      setConnectorsTicketValid(false);
      setConnectorsTicketData(null);
      setError('Invalid ticket ID. Please check and try again.');
    } finally {
      setConnectorsValidating(false);
    }
  }

  async function handleFindConnectorsTickets() {
    const email = normalizeEmail(connectorsLookupEmail);
    setConnectorsLookupError('');
    setConnectorsLookupResults([]);

    if (!email) {
      setConnectorsLookupError('Please enter your email first.');
      return;
    }
    if (!isValidEmail(email)) {
      setConnectorsLookupError('Please enter a valid email.');
      return;
    }

    try {
      setConnectorsLookupLoading(true);
      const result = await findTicketsByEmail(email);
      if (!result.tickets || result.tickets.length === 0) {
        setConnectorsLookupError('No Marketplace or Talent Regular ticket found for this email.');
        return;
      }
      setConnectorsLookupResults(result.tickets);
    } catch (err) {
      logTechnicalError(err, 'CONNECTORS_LOOKUP');
      setConnectorsLookupError(
        getUserFriendlyError(err, {
          fallback: 'Unable to check tickets right now. You can still enter your ticket ID manually.'
        })
      );
    } finally {
      setConnectorsLookupLoading(false);
    }
  }

  // Debounced validation for Connectors Pass
  function handleConnectorsTicketIdChange(value) {
    setConnectorsTicketId(value);
    
    // Clear previous validation
    setConnectorsTicketValid(false);
    setConnectorsTicketData(null);
    
    // Debounce validation
    clearTimeout(window.connectorsValidationTimeout);
    window.connectorsValidationTimeout = setTimeout(() => {
      validateConnectorsTicket(value);
    }, 500);
  }

  async function handleProceedToPayment(e) {
    e.preventDefault();
    setError('');

    const isIndividual = selectedTicket.passType === 'individual';
    const isVendor = selectedTicket.passType === 'vendor';
    const isConnectors = selectedTicket.type === 'connectors';

    // Validation
    if (isConnectors && !connectorsTicketValid) {
      setError('Please enter a valid General Access or Individual Regular ticket ID');
      return;
    }

    if (isIndividual) {
      const allFilled = attendees.every(a => a.name.trim() && a.email.trim() && a.phone.trim());
      if (!allFilled) {
        setError('Please fill in all attendee names, emails and WhatsApp numbers');
        return;
      }

      const invalidAttendeeIndex = attendees.findIndex(a => !isValidEmail(a.email));
      if (invalidAttendeeIndex !== -1) {
        setError(`Please enter a valid email for attendee ${invalidAttendeeIndex + 1}`);
        return;
      }

      if (isConnectors && !attendees[0]?.email) {
        setError('A valid email is required for Connectors Pass');
        return;
      }
    }

    if (isVendor) {
      if (!vendorData.fullName.trim() || !vendorData.businessName.trim() || 
          !vendorData.whatsapp.trim() || !vendorData.email.trim() || 
          !vendorData.category.trim()) {
        setError('Please fill in all vendor details');
        return;
      }
      if (vendorData.needElectricity === 'yes' && !vendorData.electricityAppliances.trim()) {
        setError('Please list appliances that need electricity');
        return;
      }
      if (!isValidEmail(vendorData.email)) {
        setError('Please enter a valid vendor email');
        return;
      }
    }

    if (!isIndividual && !isVendor) {
      if (!businessName.trim() || !repName.trim() || !businessEmail.trim() || !businessPhone.trim()) {
        setError('Please fill in all business details');
        return;
      }
      if (!isValidEmail(businessEmail)) {
        setError('Please enter a valid business email');
        return;
      }
    }

    setLoading(true);

    const debugApi =
      window.__CONNEXA_WEB_DEBUG__ ||
      window.__ZIDE_ADMIN_WEB_DEBUG__ ||
      window.__ZIDE_WEB_DEBUG__;

    debugApi?.addManualLog?.({
      tag: 'REGISTRATION',
      level: 'info',
      phase: 'manual_intent',
      message: 'User started ticket checkout',
      payload: {
        ticket_type: selectedTicket?.name,
        pass_type: selectedTicket?.passType,
        quantity,
      },
    });

    try {
      let totalAmount, metadata;
      const affiliateCode = getAffiliateCode();

      // Calculate discounted price
      const ticketPrice = calculateTicketPrice(selectedTicket.name, selectedTicket.price);
      const discountPercentage = getDiscountPercentage(selectedTicket.name);

      if (isIndividual) {
        const baseAmount = ticketPrice * quantity;
        const groupDiscount = selectedTicket.name === 'Marketplace Pass' ? 0 : calculateDiscount(quantity);
        let subtotal = baseAmount - groupDiscount;
        const isRegularDiscountCodeApplied = discountValid && validatedCodeType === 'discount';
        const isSpeakerCodeApplied = (discountValid && validatedCodeType === 'connexer') || (!discountValid && speakerData && speakerCode);
        
        // Apply discount code if valid
        let codeDiscountAmount = 0;
        if (discountValid && discountData) {
          codeDiscountAmount = subtotal * (discountData.discount_percentage / 100);
          subtotal -= codeDiscountAmount;
        } else if (speakerData && speakerCode) {
          // Apply speaker discount when no other discount code is used
          codeDiscountAmount = subtotal * (speakerData.discount_percentage / 100);
          subtotal -= codeDiscountAmount;
        }
        
        totalAmount = subtotal;

        metadata = {
          ticket_type: selectedTicket.name,
          pass_type: 'individual',
          quantity,
          original_price: selectedTicket.price,
          discounted_price: ticketPrice,
          discount_percentage: discountPercentage,
          group_discount: groupDiscount,
          discount_code: isRegularDiscountCodeApplied ? discountCode.toUpperCase() : null,
          discount_code_percentage: isRegularDiscountCodeApplied ? discountData.discount_percentage : null,
          discount_code_amount: isRegularDiscountCodeApplied ? codeDiscountAmount : null,
          speaker_code: isSpeakerCodeApplied ? (speakerCode || discountCode.trim()) : null,
          speaker_discount_applied: isSpeakerCodeApplied ? codeDiscountAmount : null,
          attendees: attendees.map(a => ({
            name: a.name.trim(),
            email: normalizeEmail(a.email),
            phone: a.phone.trim(),
            role_or_skill: a.role_or_skill || null
          })),
          affiliate_code: affiliateCode
        };

        // Add base ticket ID for Connectors Pass
        if (isConnectors) {
          metadata.base_ticket_id = connectorsTicketId;
          metadata.base_ticket_type = connectorsTicketData.ticket_type;
          metadata.preferred_connexer = connectorsPreferredConnexer || null;
        }
      } else if (isVendor) {
        let baseAmount = ticketPrice;
        const isRegularDiscountCodeApplied = discountValid && validatedCodeType === 'discount';
        const isSpeakerCodeApplied = (discountValid && validatedCodeType === 'connexer') || (!discountValid && speakerData && speakerCode);
        
        // Add electricity cost
        if (vendorData.needElectricity === 'yes') {
          baseAmount += 20000;
        }
        
        // Add support assistant cost
        if (vendorData.supportAssistant === 'zidepeople') {
          baseAmount += (vendorData.supportQuantity * 10000);
        }

        // Apply discount code if valid
        let codeDiscountAmount = 0;
        if (discountValid && discountData) {
          codeDiscountAmount = baseAmount * (discountData.discount_percentage / 100);
          baseAmount -= codeDiscountAmount;
        } else if (speakerData && speakerCode) {
          codeDiscountAmount = baseAmount * (speakerData.discount_percentage / 100);
          baseAmount -= codeDiscountAmount;
        }
        
        totalAmount = baseAmount;

        metadata = {
          ticket_type: selectedTicket.name,
          pass_type: 'vendor',
          original_price: selectedTicket.price,
          discounted_price: ticketPrice,
          discount_percentage: discountPercentage,
          discount_code: isRegularDiscountCodeApplied ? discountCode.toUpperCase() : null,
          discount_code_percentage: isRegularDiscountCodeApplied ? discountData.discount_percentage : null,
          discount_code_amount: isRegularDiscountCodeApplied ? codeDiscountAmount : null,
          speaker_code: isSpeakerCodeApplied ? (speakerCode || discountCode.trim()) : null,
          speaker_discount_applied: isSpeakerCodeApplied ? codeDiscountAmount : null,
          full_name: vendorData.fullName,
          business_name: vendorData.businessName,
          whatsapp: vendorData.whatsapp,
          email: normalizeEmail(vendorData.email),
          instagram_website: vendorData.instagramWebsite || null,
          category: vendorData.category,
          need_electricity: vendorData.needElectricity,
          electricity_appliances: vendorData.electricityAppliances || null,
          support_assistant: vendorData.supportAssistant,
          support_quantity: vendorData.supportQuantity,
          affiliate_code: affiliateCode
        };
      } else {
        let baseAmount = ticketPrice;
        const isRegularDiscountCodeApplied = discountValid && validatedCodeType === 'discount';
        const isSpeakerCodeApplied = (discountValid && validatedCodeType === 'connexer') || (!discountValid && speakerData && speakerCode);
        
        // Apply discount code if valid
        let codeDiscountAmount = 0;
        if (discountValid && discountData) {
          codeDiscountAmount = baseAmount * (discountData.discount_percentage / 100);
          baseAmount -= codeDiscountAmount;
        } else if (speakerData && speakerCode) {
          codeDiscountAmount = baseAmount * (speakerData.discount_percentage / 100);
          baseAmount -= codeDiscountAmount;
        }

        totalAmount = baseAmount;

        metadata = {
          ticket_type: selectedTicket.name,
          pass_type: 'business',
          original_price: selectedTicket.price,
          discounted_price: ticketPrice,
          discount_percentage: discountPercentage,
          discount_code: isRegularDiscountCodeApplied ? discountCode.toUpperCase() : null,
          discount_code_percentage: isRegularDiscountCodeApplied ? discountData.discount_percentage : null,
          discount_code_amount: isRegularDiscountCodeApplied ? codeDiscountAmount : null,
          speaker_code: isSpeakerCodeApplied ? (speakerCode || discountCode.trim()) : null,
          speaker_discount_applied: isSpeakerCodeApplied ? codeDiscountAmount : null,
          business_name: businessName,
          representative_name: repName,
          email: normalizeEmail(businessEmail),
          phone: businessPhone,
          affiliate_code: affiliateCode
        };
      }

      const buyerEmail = isIndividual
        ? normalizeEmail(attendees[0].email)
        : isVendor
          ? normalizeEmail(vendorData.email)
          : normalizeEmail(businessEmail);

      if (totalAmount <= 0) {
        // Create tickets directly without Paystack
        const response = await createFreeOrder({
          buyerEmail,
          ticketType: selectedTicket.name,
          ticketNames: isIndividual ? attendees.map(a => a.name) : [isVendor ? vendorData.fullName : repName],
          quantity: isIndividual ? quantity : 1,
          metadata
        });

        if (response.status) {
          // Redirect to success page with email delivery status for transparent messaging
          const failedCount = response?.email_delivery?.failed_count || 0;
          window.location.href = `/payment-success?reference=${response.reference}&email_failed_count=${failedCount}`;
        } else {
          setError('Order creation failed. Please try again.');
        }
        return;
      }

      const paymentData = {
        buyerEmail,
        amount: totalAmount,
        ticketType: selectedTicket.name,
        ticketNames: isIndividual ? attendees.map(a => a.name) : [isVendor ? vendorData.fullName : repName],
        quantity: isIndividual ? quantity : 1,
        metadata
      };

      const response = await initializePayment(paymentData);

      debugApi?.addManualLog?.({
        tag: 'REGISTRATION',
        level: 'info',
        phase: 'manual_result',
        message: 'Ticket payment initialization completed',
        payload: {
          ticket_type: selectedTicket?.name,
          has_authorization_url: Boolean(response?.data?.authorization_url),
        },
      });

      if (response.status && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        setError('Payment initialization failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      debugApi?.addManualLog?.({
        tag: 'REGISTRATION',
        level: 'error',
        phase: 'manual_error',
        message: 'Ticket checkout failed before redirect',
        payload: {
          ticket_type: selectedTicket?.name,
          error: err?.response?.data?.detail || err?.message || 'unknown_error',
        },
      });
      const backendMsg = err?.response?.data?.detail;
      setError(backendMsg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="tickets section" id="tickets">
      <div className="container">
        <div className="tickets-header reveal">
          <div className="section-tag">Tickets</div>
          <h2 className="section-title">
            Tickets for Connexa Lagos: <span className="highlight-orange">Join the Opportunity Playground</span>
          </h2>
          <p>Connexa is an opportunity playground in Lagos, Nigeria where people connect to real opportunities. Your ticket gives you access to people, ideas, and outcomes that move you forward.</p>

          <div className="tickets-upgrade-strip">
            <span>Already bought a ticket? Limited slots available. Tickets selling fast.</span>
            <a href="/upgrade-ticket" className="tickets-upgrade-link">Upgrade now</a>
          </div>
          
          {/* Discount Banner */}
          {discountActive && (
            <div className="tickets-discount-banner">
              <FaGift size={14} /> <strong>20% OFF</strong> all tickets (except Connectors Pass) - Limited time!
            </div>
          )}
        </div>

        <div className="tickets-grid">
          {tickets.filter(t => t.name !== 'Marketplace Pass').map((ticket, i) => {
            const discountedPrice = calculateTicketPrice(ticket.name, ticket.price);
            const hasDiscount = discountedPrice < ticket.price;
            const hasLowStock =
              !ticket.hideLowStockBadge &&
              typeof ticket.available === 'number' &&
              ticket.available > 0 &&
              ticket.available <= LOW_STOCK_THRESHOLD;

            return (
              <div
                key={ticket.type}
                className={`ticket-card reveal${ticket.featured ? ' featured' : ''}`}
                data-type={ticket.type}
                style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
              >
                {hasDiscount && (
                  <div className="ticket-card-badge badge-discount">20% OFF</div>
                )}

                {!hasDiscount && ticket.badge && (
                  <div className={`ticket-card-badge ${ticket.badgeClass || ''}`}>
                    {ticket.badge}
                  </div>
                )}

                <div className={`ticket-icon ${ticket.iconClass}`}>
                  {ticket.icon}
                </div>

                <div className="ticket-type-label">{ticket.label}</div>
                <h3 className="ticket-name">{ticket.name}</h3>
                <p className="ticket-subtitle">{ticket.subtitle}</p>

                {hasLowStock && (
                  <div className="ticket-low-stock-badge">
                    Only {ticket.available} spot{ticket.available === 1 ? '' : 's'} left
                  </div>
                )}

                {/* Show discount pricing */}
                {hasDiscount ? (
                  <div className="ticket-price-container">
                    <div className="ticket-price-original">₦{ticket.price.toLocaleString()}</div>
                    <div className="ticket-price-discounted">₦{discountedPrice.toLocaleString()}</div>
                  </div>
                ) : null}

                <div className="ticket-divider" />

                <ul className="ticket-features">
                  {ticket.features.map((f, j) => (
                    <li key={j} className="ticket-feature">
                      <span className="ticket-feature-dot" style={{ background: ticket.dotColor }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {ticket.bestFor && (
                  <div className="ticket-best-for">
                    <strong>Best for:</strong> {ticket.bestFor}
                  </div>
                )}

                {/* TICKET-SPECIFIC NOTICE */}
                {ticket?.notice && (
                  <div className="ticket-notice">
                    <span className="ticket-notice-icon">⚠️</span>
                    <span className="ticket-notice-text">{ticket.notice}</span>
                  </div>
                )}

                <button
                  onClick={() => openModal(ticket)}
                  className={`ticket-cta ${ticket.ctaClass}`}
                >
                  {ticket.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="tickets-note reveal">
          Connexa tickets are your entry into Lagos opportunities.<br />
          They are about <span>access, opportunity, and results.</span>
        </p>
      </div>

      {/* Payment Modal */}
      {modalOpen && selectedTicket && (
        <div className="ticket-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ticket-modal">
            <button className="ticket-modal-close" onClick={closeModal}>×</button>

            <h3 className="ticket-modal-title">{selectedTicket.name}</h3>
            
            {/* Show discount info */}
            {getDiscountPercentage(selectedTicket.name) > 0 && (
              <div className="ticket-modal-discount-badge">
                <FaGift size={14} /> 20% OFF - Save ₦{(selectedTicket.price - calculateTicketPrice(selectedTicket.name, selectedTicket.price)).toLocaleString()}
              </div>
            )}

            <p className="ticket-modal-price">
              {getDiscountPercentage(selectedTicket.name) > 0 ? (
                <>
                  <span className="ticket-modal-price-original">₦{selectedTicket.price.toLocaleString()}</span>
                  <span className="ticket-modal-price-discounted">₦{calculateTicketPrice(selectedTicket.name, selectedTicket.price).toLocaleString()}</span>
                </>
              ) : (
                <>₦{selectedTicket.price.toLocaleString()}</>
              )}
              {selectedTicket.passType === 'individual' && ' per ticket'}
            </p>

            <form className="ticket-modal-form" onSubmit={handleProceedToPayment}>
              
              {/* CONNECTORS PASS - TICKET VALIDATION */}
              {selectedTicket.type === 'connectors' && (
                <>
                  <div className="ticket-connectors-info">
                    ℹ️ <strong>Important:</strong> Connectors Pass requires a valid Marketplace or Talent Regular ticket.
                  </div>

                  <div className="ticket-input-group">
                    <label>Your General/Regular Ticket ID *</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="e.g., CNX2026-ABC123"
                      value={connectorsTicketId}
                      onChange={(e) => handleConnectorsTicketIdChange(e.target.value)}
                      required
                    />
                    {connectorsValidating && (
                      <small className="ticket-validating">Validating ticket...</small>
                    )}
                    {connectorsTicketValid && connectorsTicketData && (
                      <div className="ticket-valid-badge">
                        ✓ Valid {connectorsTicketData.ticket_type} - {connectorsTicketData.attendee_name}
                      </div>
                    )}
                  </div>

                  <div className="ticket-input-group">
                    <label>Don't have your ticket ID? Find it by email</label>
                    <input
                      type="email"
                      className="ticket-input"
                      placeholder="Enter the email used for your base ticket"
                      value={connectorsLookupEmail}
                      onChange={(e) => setConnectorsLookupEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      className="ticket-cta cta-orange"
                      style={{ marginTop: '10px', width: '100%' }}
                      onClick={handleFindConnectorsTickets}
                      disabled={connectorsLookupLoading}
                    >
                      {connectorsLookupLoading ? 'Finding...' : 'Find My Ticket ID'}
                    </button>
                    {connectorsLookupError && (
                      <div className="ticket-error-badge">✗ {connectorsLookupError}</div>
                    )}
                    {connectorsLookupResults.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        {connectorsLookupResults.map((ticket) => (
                          <button
                            key={ticket.ticket_id}
                            type="button"
                            className="ticket-input"
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'left',
                              cursor: 'pointer',
                              marginBottom: '8px',
                              background: 'rgba(255,255,255,0.04)'
                            }}
                            onClick={() => handleConnectorsTicketIdChange(ticket.ticket_id)}
                          >
                            <strong>{ticket.ticket_id}</strong>
                            <br />
                            <small>{ticket.attendee_name} · {ticket.ticket_type}</small>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ticket-input-group">
                    <label>Who do you want to ask a question? (Optional)</label>
                    <ConnexerDropdown
                      value={connectorsPreferredConnexer}
                      onChange={setConnectorsPreferredConnexer}
                    />
                  </div>
                </>
              )}

              {/* INDIVIDUAL PASS FORM (Non-Connectors) */}
              {selectedTicket.passType === 'individual' && selectedTicket.type !== 'connectors' && (
                <>
                  <div className="ticket-group-promo">
                    💰 Purchase tickets for 2–5 people and save on your group admission to Connexa 2026.
                  </div>

                  <div className="ticket-input-group">
                    <label>Number of Tickets</label>
                    <select
                      className="ticket-input"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-attendees">
                    <label>Attendee Details</label>
                    {attendees.map((attendee, index) => (
                      <div key={index} className="ticket-attendee-group">
                        <div className="ticket-attendee-label">Attendee {index + 1}</div>
                        <input
                          type="text"
                          className="ticket-input"
                          placeholder="Full Name"
                          value={attendee.name}
                          onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="email"
                          className="ticket-input"
                          placeholder="Email Address"
                          value={attendee.email}
                          onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                          required
                        />
                        <input
                          type="tel"
                          className="ticket-input"
                          placeholder="WhatsApp Number"
                          value={attendee.phone}
                          onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                          required
                        />
                        <SkillDropdown
                          value={attendee.role_or_skill}
                          onChange={(val) => handleAttendeeChange(index, 'role_or_skill', val)}
                        />
                      </div>
                    ))}
                  </div>

                  {(quantity >= 2 && quantity <= 5 ) && selectedTicket.name !== 'Marketplace Pass' ? (
                    <div className="ticket-discount-badge">
                      <FaUsers size={14} /> Group Discount: -₦{calculateDiscount(quantity).toLocaleString()}
                    </div>
                  ) : null}

                  <div className="ticket-input-group">
                    <label>Discount Code (Optional)</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => handleDiscountCodeChange(e.target.value.toUpperCase())}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {discountValidating && (
                      <small className="ticket-validating">Validating code...</small>
                    )}
                    {discountValid && discountData && (
                      <div className="ticket-valid-badge">
                        ✓ {discountData.discount_percentage}% discount applied!
                      </div>
                    )}
                    {discountError && (
                      <div className="ticket-error-badge">
                        ✗ {discountError}
                      </div>
                    )}
                  </div>

                  <div className="ticket-modal-total">
                    <span>Total Amount</span>
                    <div className="ticket-modal-total-breakdown">
                      {(() => {
                        // Calculate all values
                        const isMarketplacePass = selectedTicket.name === 'Marketplace Pass';
                        const groupDiscount = isMarketplacePass ? 0 : calculateDiscount(quantity);
                        const ticketPrice = calculateTicketPrice(selectedTicket.name, selectedTicket.price);
                        const subtotal = ticketPrice * quantity;
                        const total = subtotal - groupDiscount;

                        // Calculate discount code amount
                        let codeDiscountAmount = 0;
                        if (discountValid && discountData) {
                          codeDiscountAmount = total * (discountData.discount_percentage / 100);
                        }
                        
                        const finalTotal = total - codeDiscountAmount;

                        return (
                          <>
                            {/* Only show breakdown if discount exists */}
                            {groupDiscount > 0 && (
                              <>
                                <div className="ticket-modal-subtotal">
                                  ₦{subtotal.toLocaleString()}
                                </div>
                                <div className="ticket-modal-discount">
                                  -₦{groupDiscount.toLocaleString()}
                                </div>
                              </>
                            )}
                            {codeDiscountAmount > 0 && (
                              <div className="ticket-modal-discount" style={{ color: 'var(--green)' }}>
                                Code: -₦{codeDiscountAmount.toLocaleString()}
                              </div>
                            )}
                            <strong>₦{finalTotal.toLocaleString()}</strong>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}

              {/* CONNECTORS PASS - Just show total (attendee already pre-filled) */}
              {selectedTicket.type === 'connectors' && connectorsTicketValid && (
                <>
                  <div className="ticket-attendees">
                    <label>Your Details</label>
                    <div className="ticket-attendee-group">
                      <input
                        type="text"
                        className="ticket-input"
                        value={attendees[0]?.name || ''}
                        disabled
                      />
                      <input
                        type="email"
                        className="ticket-input"
                        value={attendees[0]?.email || ''}
                        disabled
                      />
                      <input
                        type="tel"
                        className="ticket-input"
                        placeholder="WhatsApp Number"
                        value={attendees[0]?.phone || ''}
                        onChange={(e) => handleAttendeeChange(0, 'phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="ticket-input-group">
                    <label>Discount Code (Optional)</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => handleDiscountCodeChange(e.target.value.toUpperCase())}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {discountValidating && (
                      <small className="ticket-validating">Validating code...</small>
                    )}
                    {discountValid && discountData && (
                      <div className="ticket-valid-badge">
                        ✓ {discountData.discount_percentage}% discount applied!
                      </div>
                    )}
                    {discountError && (
                      <div className="ticket-error-badge">
                        ✗ {discountError}
                      </div>
                    )}
                  </div>

                  <div className="ticket-modal-total">
                    <span>Total Amount</span>
                    <div className="ticket-modal-total-breakdown">
                      {/* Show breakdown if discount code is applied */}
                      {discountValid && discountData && (
                        <>
                          <div className="ticket-modal-subtotal">
                            ₦{selectedTicket.price.toLocaleString()}
                          </div>
                          <div className="ticket-modal-discount" style={{ color: 'var(--green)' }}>
                            Code: -₦{(selectedTicket.price * (discountData.discount_percentage / 100)).toLocaleString()}
                          </div>
                        </>
                      )}
                      <strong>
                        ₦{(() => {
                          if (discountValid && discountData) {
                            const discountAmount = selectedTicket.price * (discountData.discount_percentage / 100);
                            return (selectedTicket.price - discountAmount).toLocaleString();
                          }
                          return selectedTicket.price.toLocaleString();
                        })()}
                      </strong>
                    </div>
                  </div>
                </>
              )}

              {/* BUSINESS PASS FORM */}
              {selectedTicket.passType === 'business' && (
                <>
                  <div className="ticket-input-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Official company name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ticket-input-group">
                    <label>Owner/Representative Full Name</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Who will attend"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ticket-input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="ticket-input"
                      placeholder="your@email.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      required
                    />
                    <span className="ticket-input-hint">
                      For ticket delivery and follow-up
                    </span>
                  </div>

                  <div className="ticket-input-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="ticket-input"
                      placeholder="+234 XXX XXX XXXX"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ticket-input-group">
                    <label>Discount Code (Optional)</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => handleDiscountCodeChange(e.target.value.toUpperCase())}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {discountValidating && (
                      <small className="ticket-validating">Validating code...</small>
                    )}
                    {discountValid && discountData && (
                      <div className="ticket-valid-badge">
                        ✓ {discountData.discount_percentage}% discount applied!
                      </div>
                    )}
                    {discountError && (
                      <div className="ticket-error-badge">
                        ✗ {discountError}
                      </div>
                    )}
                  </div>
                  

                  <div className="ticket-modal-total">
                    <span>Total Amount</span>
                    <div className="ticket-modal-total-breakdown">
                      {(() => {
                        const isMarketplacePass = selectedTicket.name === 'Marketplace Pass';
                        const groupDiscount = isMarketplacePass ? 0 : calculateDiscount(quantity);
                        const ticketPrice = calculateTicketPrice(selectedTicket.name, selectedTicket.price);
                        const subtotal = ticketPrice * quantity;
                        let total = subtotal - groupDiscount;
                        
                        // Calculate discount code amount
                        let codeDiscountAmount = 0;
                        if (discountValid && discountData) {
                          codeDiscountAmount = total * (discountData.discount_percentage / 100);
                        }
                        
                        const finalTotal = total - codeDiscountAmount;

                        return (
                          <>
                            {groupDiscount > 0 && (
                              <>
                                <div className="ticket-modal-subtotal">
                                  ₦{subtotal.toLocaleString()}
                                </div>
                                <div className="ticket-modal-discount">
                                  -₦{groupDiscount.toLocaleString()}
                                </div>
                              </>
                            )}
                            {codeDiscountAmount > 0 && (
                              <div className="ticket-modal-discount" style={{ color: 'var(--green)' }}>
                                Code: -₦{codeDiscountAmount.toLocaleString()}
                              </div>
                            )}
                            <strong>₦{finalTotal.toLocaleString()}</strong>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}

              {/* VENDOR PASS FORM - Keep existing vendor form */}
              {selectedTicket.passType === 'vendor' && (
                <>
                  {/* ... existing vendor form fields ... */}
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="ticket-input"
                    value={vendorData.fullName}
                    onChange={(e) => setVendorData({...vendorData, fullName: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Business Name"
                    className="ticket-input"
                    value={vendorData.businessName}
                    onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    className="ticket-input"
                    value={vendorData.whatsapp}
                    onChange={(e) => setVendorData({...vendorData, whatsapp: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="ticket-input"
                    value={vendorData.email}
                    onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Instagram Page/Website (Optional)"
                    className="ticket-input"
                    value={vendorData.instagramWebsite}
                    onChange={(e) => setVendorData({...vendorData, instagramWebsite: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Category (What do you sell/showcase?)"
                    className="ticket-input"
                    value={vendorData.category}
                    onChange={(e) => setVendorData({...vendorData, category: e.target.value})}
                    required
                  />

                  {selectedTicket.type !== 'showcase' &&(
                    <div className="ticket-radio-group">
                      <label>Do you need electricity?</label>
                      <div className="ticket-radio-options">
                        <label>
                          <input
                            type="radio"
                            name="electricity"
                            value="no"
                            checked={vendorData.needElectricity === 'no'}
                            onChange={(e) => setVendorData({...vendorData, needElectricity: e.target.value})}
                          />
                          No
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="electricity"
                            value="yes"
                            checked={vendorData.needElectricity === 'yes'}
                            onChange={(e) => setVendorData({...vendorData, needElectricity: e.target.value})}
                          />
                          Yes (+₦20,000)
                        </label>
                      </div>
                    </div>
                  )}

                  {vendorData.needElectricity === 'yes' && (
                    <textarea
                      placeholder="List appliances you need electricity for"
                      className="ticket-input"
                      value={vendorData.electricityAppliances}
                      onChange={(e) => setVendorData({...vendorData, electricityAppliances: e.target.value})}
                      rows="3"
                      required
                    />
                  )}

                  {selectedTicket.type !== 'showcase' &&(
                    <div className="ticket-radio-group">
                      <label>Will you require a support assistant?</label>
                      <div className="ticket-radio-options">
                        <label>
                          <input
                            type="radio"
                            name="support"
                            value="no"
                            checked={vendorData.supportAssistant === 'no'}
                            onChange={(e) => setVendorData({...vendorData, supportAssistant: e.target.value})}
                          />
                          No, I do not require support
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="support"
                            value="zidepeople"
                            checked={vendorData.supportAssistant === 'zidepeople'}
                            onChange={(e) => setVendorData({...vendorData, supportAssistant: e.target.value})}
                          />
                          Yes – Zidepeople assistant (₦10,000 each)
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="support"
                            value="own"
                            checked={vendorData.supportAssistant === 'own'}
                            onChange={(e) => setVendorData({...vendorData, supportAssistant: e.target.value})}
                          />
                          Yes – Bringing my own assistant
                        </label>
                      </div>
                    </div>
                  )}

                  {vendorData.supportAssistant === 'zidepeople' && (
                    <div className="ticket-quantity-group">
                      <label>How many support assistants do you need?</label>
                      <div className="ticket-quantity-controls">
                        <button 
                          type="button"
                          onClick={() => setVendorData({
                            ...vendorData, 
                            supportQuantity: Math.max(1, vendorData.supportQuantity - 1)
                          })}
                          className="ticket-quantity-btn"
                        >
                          −
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={vendorData.supportQuantity}
                          onChange={(e) => setVendorData({
                            ...vendorData, 
                            supportQuantity: Math.max(1, parseInt(e.target.value) || 1)
                          })}
                          className="ticket-quantity-input"
                        />
                        <button 
                          type="button"
                          onClick={() => setVendorData({
                            ...vendorData, 
                            supportQuantity: Math.min(10, vendorData.supportQuantity + 1)
                          })}
                          className="ticket-quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="ticket-quantity-total">
                        Support cost: ₦{(vendorData.supportQuantity * 10000).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {vendorData.supportAssistant === 'own' && (
                    <div className="ticket-info-box">
                      ℹ️ Your assistant must register and purchase an individual ticket separately.
                    </div>
                  )}

                  <div className="ticket-price-breakdown">
                    <h4>Price Breakdown</h4>
                    <div className="ticket-price-item">
                      <span>Base Pass:</span>
                      <span>₦{calculateTicketPrice(selectedTicket.name, selectedTicket.price).toLocaleString()}</span>
                    </div>
                    
                    {vendorData.needElectricity === 'yes' && (
                      <div className="ticket-price-item">
                        <span>Electricity:</span>
                        <span>+₦20,000</span>
                      </div>
                    )}
                    
                    {vendorData.supportAssistant === 'zidepeople' && (
                      <div className="ticket-price-item">
                        <span>Support ({vendorData.supportQuantity} assistant{vendorData.supportQuantity > 1 ? 's' : ''}):</span>
                        <span>+₦{(vendorData.supportQuantity * 10000).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="ticket-input-group">
                      <label>Discount Code (Optional)</label>
                      <input
                        type="text"
                        className="ticket-input"
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => handleDiscountCodeChange(e.target.value.toUpperCase())}
                        style={{ textTransform: 'uppercase' }}
                      />
                      {discountValidating && (
                        <small className="ticket-validating">Validating code...</small>
                      )}
                      {discountValid && discountData && (
                        <div className="ticket-valid-badge">
                          ✓ {discountData.discount_percentage}% discount applied!
                        </div>
                      )}
                      {discountError && (
                        <div className="ticket-error-badge">
                          ✗ {discountError}
                        </div>
                      )}
                    </div>
                    
                    {discountValid && discountData && (
                      <>
                        <div className="ticket-price-item" style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid var(--border)' }}>
                          <span>Subtotal:</span>
                          <span>₦{(
                            calculateTicketPrice(selectedTicket.name, selectedTicket.price) + 
                            (vendorData.needElectricity === 'yes' ? 20000 : 0) + 
                            (vendorData.supportAssistant === 'zidepeople' ? vendorData.supportQuantity * 10000 : 0)
                          ).toLocaleString()}</span>
                        </div>
                        <div className="ticket-price-item" style={{ color: 'var(--green)' }}>
                          <span>Discount ({discountData.discount_percentage}%):</span>
                          <span>-₦{(() => {
                            const subtotal = calculateTicketPrice(selectedTicket.name, selectedTicket.price) + 
                              (vendorData.needElectricity === 'yes' ? 20000 : 0) + 
                              (vendorData.supportAssistant === 'zidepeople' ? vendorData.supportQuantity * 10000 : 0);
                            return (subtotal * (discountData.discount_percentage / 100)).toLocaleString();
                          })()}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="ticket-price-total">
                      <span>Total:</span>
                      <span>₦{(() => {
                        const baseTotal = calculateTicketPrice(selectedTicket.name, selectedTicket.price) + 
                          (vendorData.needElectricity === 'yes' ? 20000 : 0) + 
                          (vendorData.supportAssistant === 'zidepeople' ? vendorData.supportQuantity * 10000 : 0);
                        
                        if (discountValid && discountData) {
                          const discountAmount = baseTotal * (discountData.discount_percentage / 100);
                          return (baseTotal - discountAmount).toLocaleString();
                        }
                        
                        return baseTotal.toLocaleString();
                      })()}</span>
                    </div>
                  </div>
                </>
              )}

              {error && <div className="ticket-modal-error">{error}</div>}

              <button
                type="submit"
                className="ticket-modal-submit"
                disabled={loading || (selectedTicket.type === 'connectors' && !connectorsTicketValid)}
              >
                {loading ? 'Processing...' : 'Join the Opportunity Playground'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
