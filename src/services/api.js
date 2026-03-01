import axios from 'axios';

//const PAYSTACK_SECRET_KEY = 'sk_live_c58363dfd6faf9bd2b81568330ecc563f02572c3';
const PAYSTACK_SECRET_KEY = 'sk_test_41296c97d16db0d5baaca5e3589329542f292305';
const BACKEND_URL = 'https://connexa-aahsexcjcfakfhbd.southafricanorth-01.azurewebsites.net';

// Update initializePayment to include affiliate code
export const initializePayment = async (paymentData) => {
  try {
    const affiliateCode = getAffiliateCode();
    
    // Merge the passed metadata with affiliate_code
    const metadata = {
      ...paymentData.metadata,  // Use the metadata from Tickets.jsx
      affiliate_code: affiliateCode,
    };
    
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: paymentData.buyerEmail,
        amount: paymentData.amount * 100,
        metadata: metadata,  // Use the merged metadata
        callback_url: `${window.location.origin}/payment-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
    // Step 1: Initialize vote on backend
    const response = await axios.post(`${BACKEND_URL}/votes/initialize`, voteData);
    const { amount, metadata, voter_email } = response.data;

    // Step 2: Initialize Paystack payment
    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: voter_email,
        amount: amount * 100, // Use the amount from backend response
        metadata: metadata,
        callback_url: `${window.location.origin}/vote-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
    // Step 1: Initialize order on backend
    const response = await axios.post(`${BACKEND_URL}/merch/initialize`, orderData);
    const { amount, metadata, buyer_email } = response.data;

    // Step 2: Initialize Paystack payment
    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: buyer_email,
        amount: amount * 100, // Convert to kobo
        metadata: metadata,
        callback_url: `${window.location.origin}/merch-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
    localStorage.setItem('affiliate_code', ref);
    return ref;
  }
  
  // Retrieve stored code if exists
  return localStorage.getItem('affiliate_code') || null;
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