import axios from 'axios';

const PAYSTACK_SECRET_KEY = 'sk_test_REPLACE_WITH_ACTUAL_KEY';
const BACKEND_URL = 'http://backend-url.com';

export const initializePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: paymentData.buyerEmail,
        amount: paymentData.amount * 100,
        metadata: {
          ticket_type: paymentData.ticketType,
          ticket_names: paymentData.ticketNames,
          quantity: paymentData.quantity,
        },
        callback_url: `${window.location.origin}/payment-success`, // User returns here after payment
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
