import axios from 'axios';

const BACKEND_URL = 'https://connexa-aahsexcjcfakfhbd.southafricanorth-01.azurewebsites.net';
//const BACKEND_URL = 'http://127.0.0.1:8000';

export const initializePayment = async (paymentData) => {
  try {
    const affiliateCode = getAffiliateCode();

    const metadata = {
      ...paymentData.metadata,
      affiliate_code: affiliateCode,
    };

    const response = await axios.post(`${BACKEND_URL}/payments/initialize`, {
      email: paymentData.buyerEmail,
      amount: paymentData.amount,
      metadata,
      callback_url: `${window.location.origin}/payment-success`,
    });

    return response.data;
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};


export const verifyPayment = async (reference) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/payments/verify`, {
      reference,
    });

    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};

// Create free order (100% discount)
export const createFreeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/payments/free-order`, orderData);
    return response.data;
  } catch (error) {
    console.error('Free order creation failed:', error);
    throw error;
  }
};

// ===================== CANDIDATES =====================
export const getCandidates = async (candidateType = null) => {
  try {
    const params = candidateType ? { candidate_type: candidateType } : {};
    const response = await axios.get(`${BACKEND_URL}/candidates`, { params });
    console.log('Fetched candidates:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    throw error;
  }
};

export const getCandidate = async (candidateId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/candidates/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch candidate:', error);
    throw error;
  }
};

// ===================== VOTING =====================
export const initializeVote = async (voteData) => {
  try {
    // Step 1: Initialize vote on backend to get metadata/amount
    const initResponse = await axios.post(`${BACKEND_URL}/votes/initialize`, voteData);
    const { amount, metadata, voter_email } = initResponse.data;

    // Step 2: Initialize Paystack payment via backend (secret key stays server-side)
    const paystackResponse = await axios.post(`${BACKEND_URL}/payments/initialize`, {
      email: voter_email,
      amount,
      metadata,
      callback_url: `${window.location.origin}/vote-success`,
    });

    return paystackResponse.data;
  } catch (error) {
    console.error('Vote initialization failed:', error);
    throw error;
  }
};

export const verifyVote = async (reference) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/votes/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Vote verification failed:', error);
    throw error;
  }
};

export const getCandidateVoteCount = async (candidateId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/votes/candidate/${candidateId}/count`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vote count:', error);
    throw error;
  }
};

export const getVotingStats = async (candidateType = null) => {
  try {
    const params = candidateType ? { candidate_type: candidateType } : {};
    const response = await axios.get(`${BACKEND_URL}/votes/stats`, { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch voting stats:', error);
    throw error;
  }
};



// ===================== MERCH =====================
export const initializeMerchOrder = async (orderData) => {
  try {
    // Step 1: Initialize order on backend to get metadata/amount
    const initResponse = await axios.post(`${BACKEND_URL}/merch/initialize`, orderData);
    const { amount, metadata, buyer_email } = initResponse.data;

    // Step 2: Initialize Paystack payment via backend (secret key stays server-side)
    const paystackResponse = await axios.post(`${BACKEND_URL}/payments/initialize`, {
      email: buyer_email,
      amount,
      metadata,
      callback_url: `${window.location.origin}/merch-success`,
    });

    return paystackResponse.data;
  } catch (error) {
    console.error('Merch order initialization failed:', error);
    throw error;
  }
};

export const verifyMerchOrder = async (reference) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/merch/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Merch order verification failed:', error);
    throw error;
  }
};

export const getBuyerOrders = async (email) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/merch/orders/buyer/${email}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch buyer orders:', error);
    throw error;
  }
};




// Add this helper function at the top
export const getAffiliateCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  
  // Store in localStorage for persistence across navigation
  if (ref) {
    return ref;
  }
  
  // Retrieve stored code if exists
  return null;
};

export const submitPartnership = async (formData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/partnerships/submit`, {
      application_type: formData.applicationType,
      applicant_type: formData.applicantType,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      organization_name: formData.organizationName,
      website_social: formData.websiteSocial,
      sponsorship_type: formData.sponsorshipType,
      involvement: formData.involvement
    });

    return response.data;
  } catch (error) {
    console.error('Partnership submission failed:', error);
    throw error;
  }
};


// Candidate signup
export const signupBusinessCandidate = async (candidateData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/candidates/signup/business`, candidateData);
    return response.data;
  } catch (error) {
    console.error('Business candidate signup failed:', error);
    throw error;
  }
};

export const signupIndividualCandidate = async (candidateData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/candidates/signup/individual`, candidateData);
    return response.data;
  } catch (error) {
    console.error('Individual candidate signup failed:', error);
    throw error;
  }
};

// Affiliate signup
export const signupAffiliate = async (formData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/affiliates/signup`, formData);
    return response.data;
  } catch (error) {
    console.error('Affiliate signup failed:', error);
    throw error;
  }
};








// Speaker Questions
export const submitSpeakerQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/speaker-questions/submit`, questionData);
    return response.data;
  } catch (error) {
    console.error('Question submission failed:', error);
    throw error;
  }
};

export const validateTicketId = async (ticketId) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/speaker-questions/validate-ticket`, null, {
      params: { ticket_id: ticketId }
    });
    return response.data;
  } catch (error) {
    console.error('Ticket validation failed:', error);
    throw error;
  }
};

// Ticket Upgrades
export const getUpgradeOptions = async (ticketId) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/ticket-upgrades/get-options`, null, {
      params: { ticket_id: ticketId }
    });
    return response.data;
  } catch (error) {
    console.error('Get upgrade options failed:', error);
    throw error;
  }
};

export const initializeUpgrade = async (upgradeData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/ticket-upgrades/initialize`, upgradeData);
    return response.data;
  } catch (error) {
    console.error('Upgrade initialization failed:', error);
    throw error;
  }
};

// Validate discount code
// Validate discount code
export const validateDiscountCode = async (code, userEmail, amount, discountType, ticketType = null) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/discount-codes/validate`, {
      code: code,
      user_email: userEmail,
      amount: amount,
      discount_type: discountType,
      ticket_type: ticketType  // ADD THIS
    });
    return response.data;
  } catch (error) {
    console.error('Discount code validation failed:', error);
    throw error;
  }
};