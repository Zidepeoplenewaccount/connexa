import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, exportOrders } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      const data = await getAllOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  }

  async function handleExport() {
    try {
      const blob = await exportOrders();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
    } catch (error) {
      alert('Export failed');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading-msg">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Merch Orders</h1>
        <button className="admin-btn" onClick={handleExport}>📥 Export CSV</button>
      </div>

      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
        style={{
          padding: '10px 16px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          marginBottom: '24px'
        }}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <div className="admin-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td><code>{order.order_id}</code></td>
                    <td>
                      <strong>{order.buyer_name}</strong>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        {order.buyer_email}
                      </div>
                    </td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>₦{order.total_amount?.toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          background: '#0a0a0a',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}