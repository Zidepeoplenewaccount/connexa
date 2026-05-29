import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useScrollReveal } from './hooks/ScrollReveal';

import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Tickets from './components/Tickets';
import FAQ from './components/FAQ';
import Merch from './components/merch';
import PartnerForm from './components/PartnerForm';
import AffiliateSignup from './components/AffiliateSignup';
import Footer from './components/Footer';

import PaymentSuccess from './components/paymentSuccess';
import VoteSuccess from './pages/VoteSuccess';
import MerchSuccess from './pages/MerchSuccess';
import UpgradeSuccess from './pages/UpgradeSuccess';
import UpgradeTicket from './pages/UpgradeTicket';

import AdminLogin from './features/auth/admin-login-page';
import AdminDashboard from './features/admin/admin-dashboard-page';
import AdminTickets from './features/admin/admin-tickets-page';
import AdminCandidates from './features/admin/admin-candidates-page';
import AdminVotes from './features/admin/admin-votes-page';
import AdminOrders from './features/admin/admin-orders-page';
import AdminPayments from './features/admin/admin-payments-page';
import AdminAffiliates from './features/admin/admin-affiliates-page';
import AdminDiscountCodes from './features/admin/admin-discount-codes-page';
import AdminSpeakers from './features/admin/admin-speakers-page';
import AdminQuestionsPage from './features/admin/admin-questions-page';

import SpeakerLogin from './features/auth/connexer-login-page';
import ConnexerDashboardPage from './features/auth/connexer-dashboard-page';
import SpeakerResetPassword from './features/auth/connexer-reset-password-page';
import DebugPanel from './debug/DebugPanel';

import ProtectedRoute from './features/auth/admin-protected-route';
import AdminScannerPage from './features/auth/admin-scanner-page';
import ScannerProtectedRoute from './features/auth/scanner-protected-route';

function HomePage() {
  useScrollReveal();

  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Tickets />

        <section className="affiliate-spotlight section reveal" id="share-earn">
          <div className="container">
            <div className="affiliate-spotlight-inner">
              <div>
                <p className="affiliate-spotlight-tag">Be part of the team.</p>
                <h3>Earn by sharing Connexa tickets</h3>
                <p>
                  Get your affiliate link in minutes and earn commission on every successful ticket referral.
                </p>
              </div>
              <a href="#affiliate" className="affiliate-spotlight-btn">Join Affiliate Program</a>
            </div>
          </div>
        </section>

        <FAQ />
        <Merch />
        <PartnerForm />
        <AffiliateSignup />
      </main>

      <a href="#tickets" className="mobile-sticky-ticket-cta" aria-label="Get tickets">
        Join the Opportunity Playground →
      </a>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/vote-success" element={<VoteSuccess />} />
        <Route path="/merch-success" element={<MerchSuccess />} />
        <Route path="/upgrade-ticket" element={<UpgradeTicket />} />
        <Route path="/upgrade-success" element={<UpgradeSuccess />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute>
              <AdminTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <ProtectedRoute>
              <AdminCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/votes"
          element={
            <ProtectedRoute>
              <AdminVotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/affiliates"
          element={
            <ProtectedRoute>
              <AdminAffiliates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute>
              <AdminQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/discount-codes" element={<AdminDiscountCodes />} />
        <Route
          path="/admin/connexers"
          element={
            <ProtectedRoute>
              <AdminSpeakers />
            </ProtectedRoute>
          }
        />

        <Route path="/connexers/login" element={<SpeakerLogin />} />
        <Route path="/connexers/reset-password" element={<SpeakerResetPassword />} />
        <Route path="/connexers/dashboard" element={<ConnexerDashboardPage />} />

        <Route
          path="/admin/scanner"
          element={
            <ScannerProtectedRoute>
              <AdminScannerPage />
            </ScannerProtectedRoute>
          }
        />
      </Routes>
      <DebugPanel />
    </BrowserRouter>
  );
}
