import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

const VENDORS = ['Salsar Cakes', 'Nature mix zobo'];

export default function AdminFoodWalletRegistersPage() {
  return (
    <AdminLayout>
      <div className="admin-page-header no-print">
        <div>
          <h1>Vendor Paper Sales Registers</h1>
          <p style={{ color: 'rgba(255,255,255,.55)', marginTop: 6 }}>Print one register for each participating vendor.</p>
        </div>
        <button className="admin-btn" onClick={() => window.print()}>Print registers</button>
      </div>
      <div className="food-register-print">
        {VENDORS.map((vendor, index) => (
          <section className="food-register-sheet" key={vendor}>
            <div className="food-register-header">
              <div>
                <div className="food-register-brand">CONNEXA 2026</div>
                <h1>Food Wallet Sales Register</h1>
                <p>28 November 2026 · University of Lagos Indoor Sports Hall, Akoka</p>
              </div>
              <div className="food-register-number">VENDOR {String(index + 1).padStart(2, '0')}</div>
            </div>
            <div className="food-register-vendor">Vendor / Business: <strong>{vendor}</strong></div>
            <p className="food-register-instruction">Record each attendee food-wallet purchase after checking their digital confirmation. Keep this sheet for end-of-day reconciliation.</p>
            <table>
              <thead>
                <tr><th>No.</th><th>Time</th><th>Ticket ID</th><th>Item sold</th><th>Qty</th><th>Amount (₦)</th><th>Confirmation reference</th></tr>
              </thead>
              <tbody>
                {Array.from({ length: 22 }, (_, row) => (
                  <tr key={row}><td>{row + 1}</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                ))}
              </tbody>
            </table>
            <div className="food-register-total">Total recorded sales: ₦ __________________________</div>
            <div className="food-register-signoff">
              <span>Vendor representative: __________________________</span>
              <span>Signature: ____________________</span>
            </div>
            <p className="food-register-footnote">This register is a vendor-side backup record. Connexa's confirmed digital transaction records are the primary reconciliation source. Any differences must be reviewed by the Connexa admin team before reimbursement.</p>
          </section>
        ))}
      </div>
      <style>{`
        .food-register-print{color:#111}
        .food-register-sheet{background:#fff;color:#111;padding:30px;margin:0 auto 24px;max-width:1100px;border-radius:8px}
        .food-register-header{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #fd6025;padding-bottom:16px}
        .food-register-brand{font-size:13px;font-weight:900;letter-spacing:2px;color:#fd6025}
        .food-register-header h1{font-size:25px;margin:8px 0 4px}
        .food-register-header p,.food-register-instruction{font-size:11px;color:#555}
        .food-register-number{font-weight:900;font-size:12px;letter-spacing:1px}
        .food-register-vendor{margin:20px 0 8px;font-size:14px}
        .food-register-instruction{margin-bottom:14px}
        .food-register-sheet table{width:100%;border-collapse:collapse;font-size:10px}
        .food-register-sheet th,.food-register-sheet td{border:1px solid #999;padding:8px 6px;text-align:left;height:30px;color:#111}
        .food-register-sheet th{background:#edf1ee;font-size:9px;text-transform:uppercase}
        .food-register-total{text-align:right;font-weight:800;margin:20px 0;font-size:13px}
        .food-register-signoff{display:flex;justify-content:space-between;gap:20px;font-size:11px;margin:20px 0}
        .food-register-footnote{font-size:9px;line-height:1.5;color:#555;border-top:1px solid #bbb;padding-top:10px}
        @media print{
          @page{size:A4 landscape;margin:10mm}
          body{background:#fff!important}
          .admin-root,.admin-wrapper,.admin-content-wrapper,.admin-page-inner{background:#fff!important;color:#111!important;display:block!important;margin:0!important;padding:0!important;width:100%!important;min-height:0!important}
          .admin-sidebar,.admin-mobile-toggle,.no-print{display:none!important}
          .food-register-sheet{max-width:none;margin:0;padding:0;border-radius:0;page-break-after:always;break-after:page}
          .food-register-sheet:last-child{page-break-after:auto;break-after:auto}
          .food-register-sheet th,.food-register-sheet td{height:26px;padding:6px}
        }
      `}</style>
    </AdminLayout>
  );
}
