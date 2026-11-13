import axios from 'axios';

const BACKEND_URL = 'https://zidepeople-backend.onrender.com';
const foodWalletApi = axios.create({ baseURL: BACKEND_URL });

export const getFoodWalletVendors = async () =>
  (await foodWalletApi.get('/connexa-food-wallet/vendors')).data;

export const validateFoodWalletTicket = async (ticketId) =>
  (await foodWalletApi.post('/connexa-food-wallet/ticket/validate', {
    ticket_id: ticketId,
  })).data;

export const submitFoodWalletPurchase = async (purchase) =>
  (await foodWalletApi.post('/connexa-food-wallet/transactions', {
    ticket_id: purchase.ticketId,
    vendor_name: purchase.vendorName,
    item_name: purchase.itemName,
    quantity: Number(purchase.quantity),
    amount: Number(purchase.amount),
  })).data;
