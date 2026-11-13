import { useEffect, useState } from 'react';
import {
  getFoodWalletVendors,
  validateFoodWalletTicket,
  submitFoodWalletPurchase,
} from '../services/foodWalletApi';
import './FoodWallet.css';

const money = (value) => `₦${Number(value || 0).toLocaleString('en-NG', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})}`;

export default function FoodWalletPage() {
  const [ticketId, setTicketId] = useState('');
  const [wallet, setWallet] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    getFoodWalletVendors()
      .then((data) => setVendors(data.vendors || []))
      .catch(() => setError('We could not load the vendor list. Please refresh and try again.'));
  }, []);

  async function checkTicket(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    setConfirmation(null);
    try {
      const data = await validateFoodWalletTicket(ticketId.trim());
      setWallet(data);
    } catch (err) {
      setWallet(null);
      setError(err.response?.data?.detail || 'We could not verify that ticket ID.');
    } finally {
      setLoading(false);
    }
  }

  function reviewPurchase(event) {
    event.preventDefault();
    setError('');
    const parsedAmount = Number(amount);
    const parsedQuantity = Number(quantity);
    if (!vendorName) return setError('Select the vendor you are buying from.');
    if (!itemName.trim()) return setError('Enter the item you are buying.');
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 100) {
      return setError('Enter a valid quantity.');
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return setError('Enter a valid purchase amount.');
    }
    if (parsedAmount > wallet.balance) {
      return setError(`Your remaining food allowance is ${money(wallet.balance)}.`);
    }
    setConfirmation({
      vendorName,
      itemName: itemName.trim(),
      quantity: parsedQuantity,
      amount: parsedAmount,
    });
  }

  async function confirmPurchase() {
    if (!confirmation || loading) return;
    setLoading(true);
    setError('');
    try {
      const result = await submitFoodWalletPurchase({
        ticketId: wallet.ticket_id,
        ...confirmation,
      });
      setWallet((current) => ({
        ...current,
        allowance: result.allowance,
        spent: result.spent,
        balance: result.balance,
      }));
      setNotice('Purchase recorded successfully. Show the confirmation below to the vendor.');
      setConfirmation(null);
      setItemName('');
      setQuantity('1');
      setAmount('');
      setVendorName('');
      setReceipt(result.transaction);
    } catch (err) {
      setError(err.response?.data?.detail || 'We could not record this purchase. Please try again.');
      setConfirmation(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="food-wallet-page">
      <div className="food-wallet-shell">
        <header className="food-wallet-brand">
          <span className="food-wallet-mark">CONNEXA 2026</span>
          <span className="food-wallet-kicker">THE OPPORTUNITY PLAYGROUND</span>
        </header>

        <section className="food-wallet-card">
          <div className="food-wallet-heading">
            <p className="food-wallet-eyebrow">ATTENDEE BENEFIT</p>
            <h1>Food Wallet</h1>
            <p>Use your eligible Connexa food allowance when buying from participating vendors.</p>
          </div>

          {!wallet ? (
            <form onSubmit={checkTicket} className="food-wallet-form">
              <label htmlFor="food-ticket-id">Enter your ticket ID</label>
              <input
                id="food-ticket-id"
                value={ticketId}
                onChange={(event) => setTicketId(event.target.value)}
                placeholder="Your Connexa ticket ID"
                autoComplete="off"
                required
              />
              {error && <div className="food-wallet-alert food-wallet-alert-error">{error}</div>}
              <button className="food-wallet-primary" type="submit" disabled={loading || !ticketId.trim()}>
                {loading ? 'Checking ticket…' : 'Access my food wallet'}
              </button>
              <div className="food-wallet-eligibility">
                <strong>Eligible ticket holders</strong>
                <span>Talent VIP</span>
                <span>Business Owner</span>
                <small>Other ticket types do not include a food allowance.</small>
              </div>
            </form>
          ) : (
            <div className="food-wallet-account">
              <div className="food-wallet-welcome">
                <div>
                  <span className="food-wallet-muted">Welcome</span>
                  <h2>{wallet.attendee_name}</h2>
                  <span className="food-wallet-ticket">{wallet.ticket_type} · {wallet.ticket_id}</span>
                </div>
                <button type="button" className="food-wallet-text-button" onClick={() => {
                  setWallet(null); setReceipt(null); setNotice(''); setError('');
                }}>Change ticket</button>
              </div>

              <div className="food-wallet-balance">
                <span>Available food allowance</span>
                <strong>{money(wallet.balance)}</strong>
                <div className="food-wallet-balance-meta">
                  <span>Allowance: {money(wallet.allowance)}</span>
                  <span>Used: {money(wallet.spent)}</span>
                </div>
              </div>

              {notice && <div className="food-wallet-alert food-wallet-alert-success">{notice}</div>}
              {error && <div className="food-wallet-alert food-wallet-alert-error">{error}</div>}

              {receipt && (
                <div className="food-wallet-receipt">
                  <div className="food-wallet-receipt-status">✓ PURCHASE RECORDED</div>
                  <h3>Show this confirmation to the vendor</h3>
                  <div className="food-wallet-reference">{receipt.confirmation_code}</div>
                  <div className="food-wallet-receipt-row"><span>Vendor</span><b>{receipt.vendor_name}</b></div>
                  <div className="food-wallet-receipt-row"><span>Item</span><b>{receipt.item_name} × {receipt.quantity}</b></div>
                  <div className="food-wallet-receipt-row"><span>Amount</span><b>{money(receipt.amount)}</b></div>
                  <small>Keep this confirmation until you receive your item.</small>
                </div>
              )}

              {Number(wallet.balance) > 0 ? (
                <form className="food-wallet-form food-wallet-purchase-form" onSubmit={reviewPurchase}>
                  <h3>Record a purchase</h3>
                  <p>Ask the vendor for the price, then enter the purchase details below.</p>
                  <label htmlFor="food-vendor">Select vendor</label>
                  <select id="food-vendor" value={vendorName} onChange={(event) => setVendorName(event.target.value)} required>
                    <option value="">Choose a participating vendor</option>
                    {vendors.map((vendor) => <option value={vendor} key={vendor}>{vendor}</option>)}
                  </select>

                  <label htmlFor="food-item">What are you buying?</label>
                  <input id="food-item" value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder="e.g. Meat pie" maxLength={160} required />

                  <div className="food-wallet-fields">
                    <div>
                      <label htmlFor="food-quantity">Quantity</label>
                      <input id="food-quantity" type="number" min="1" max="100" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="food-amount">Total price (₦)</label>
                      <input id="food-amount" type="number" min="1" max={wallet.balance} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 1000" required />
                    </div>
                  </div>
                  <button className="food-wallet-primary" type="submit">Review purchase</button>
                </form>
              ) : (
                <div className="food-wallet-empty">Your food allowance has been fully used.</div>
              )}
            </div>
          )}
        </section>
        <footer className="food-wallet-footer">
          <span>Powered by Zidepeople</span>
          <span>Connexa 2026 · 28 November</span>
        </footer>
      </div>

      {confirmation && (
        <div className="food-wallet-modal-backdrop" role="presentation">
          <section className="food-wallet-modal" role="dialog" aria-modal="true" aria-labelledby="food-confirm-title">
            <p className="food-wallet-eyebrow">CHECK BEFORE SUBMITTING</p>
            <h2 id="food-confirm-title">Confirm your purchase</h2>
            <div className="food-wallet-receipt-row"><span>Vendor</span><b>{confirmation.vendorName}</b></div>
            <div className="food-wallet-receipt-row"><span>Item</span><b>{confirmation.itemName}</b></div>
            <div className="food-wallet-receipt-row"><span>Quantity</span><b>{confirmation.quantity}</b></div>
            <div className="food-wallet-receipt-row"><span>Total</span><b>{money(confirmation.amount)}</b></div>
            <div className="food-wallet-receipt-row"><span>Balance after purchase</span><b>{money(wallet.balance - confirmation.amount)}</b></div>
            <p className="food-wallet-modal-note">Only confirm if the vendor has quoted this price and you are ready to collect the item. This transaction cannot be cancelled by you once submitted.</p>
            <div className="food-wallet-modal-actions">
              <button type="button" className="food-wallet-secondary" onClick={() => setConfirmation(null)} disabled={loading}>Go back</button>
              <button type="button" className="food-wallet-primary" onClick={confirmPurchase} disabled={loading}>{loading ? 'Recording…' : 'Confirm purchase'}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
