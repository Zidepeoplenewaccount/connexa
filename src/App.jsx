import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useScrollReveal } from './hooks/ScrollReveal';

import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Speakers from './components/speakers';
import Playgrounders from './components/Playgrounders';
import VoicesOfOpportunity from './components/VoicesOfOpportunity';
import Gallery from './components/Gallery';
import Tickets from './components/Tickets';
import Awards from './components/Awards';
import Voting from './components/Voting';
import FAQ from './components/FAQ';
import Merch from './components/merch';
import PartnerForm from './components/PartnerForm';
import SponsorsPartners from './components/SponsorsPartners';
import AffiliateSignup from './components/AffiliateSignup';
import PoweredBy from './components/PoweredBy';
import Footer from './components/Footer';
import FloatingControls from './components/FloatingControls';

import PaymentSuccess from './components/paymentSuccess';
import VoteSuccess from './pages/VoteSuccess';
import MerchSuccess from './pages/MerchSuccess';
import UpgradeSuccess from './pages/UpgradeSuccess';
import UpgradeTicket from './pages/UpgradeTicket';
import ExhibitorPage from './pages/ExhibitorPage';

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
      <main className="conversion-site">
        <Hero />
        <About />
        <section className="conversion-audience section" id="who-its-for">
          <div className="container">
            <div className="conversion-section-heading">
              <p className="section-tag">There is a place for you</p>
              <h2 className="section-title">Come for what you need. <span>Leave with more.</span></h2>
              <p>Whatever stage you are at, CONNEXA gives you a room full of people, ideas and possibilities to explore.</p>
            </div>
            <div className="conversion-audience-grid">
              <article><span className="conversion-audience-symbol">01</span><h3>Talent</h3><p>Show your skills, meet businesses and discover your next opportunity.</p></article>
              <article><span className="conversion-audience-symbol">02</span><h3>Business owners</h3><p>Get practical ideas, meet potential customers and find ways to grow.</p></article>
              <article><span className="conversion-audience-symbol">03</span><h3>Creatives</h3><p>Put your work in the room and meet people who value what you create.</p></article>
              <article><span className="conversion-audience-symbol">04</span><h3>Students</h3><p>Explore career paths, ask questions and meet people doing the work.</p></article>
              <article><span className="conversion-audience-symbol">05</span><h3>Entrepreneurs</h3><p>Find fresh perspectives, potential collaborators and business opportunities.</p></article>
            </div>
          </div>
        </section>
        <Speakers />
        <Playgrounders />
        <VoicesOfOpportunity />
        <Tickets />
        <SponsorsPartners />
        <FAQ />



        <section className="affiliate-spotlight section" id="share-earn">
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

        <Awards />
        <Voting />
        <Merch />
        <PartnerForm />
        <AffiliateSignup />
        <Gallery />

        <section className="conversion-final-cta">
          <div className="container">
            <p className="conversion-eyebrow">ONE ROOM. ONE DAY. NEW POSSIBILITIES.</p>
            <h2>Your next move starts <span>when you show up.</span></h2>
            <p>Join 2,000+ people expected at Africa’s first Opportunity Playground on 28 November in Lagos.</p>
            <a href="#tickets" className="btn-primary conversion-primary-cta">Get Your Ticket <span aria-hidden="true">→</span></a>
            <small>28 November 2026 · UNILAG Indoor Sports Hall, Akoka</small>
          </div>
        </section>
      </main>

      <a href="#tickets" className="mobile-sticky-ticket-cta" aria-label="Get tickets">
        Get Your Ticket →
      </a>

      <PoweredBy />
      <Footer />
      <FloatingControls />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exhibitors" element={<ExhibitorPage />} />
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
