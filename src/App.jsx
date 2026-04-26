import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
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
import BlogPreview from './components/BlogPreview';

import PaymentSuccess from './components/paymentSuccess';
import VoteSuccess from './pages/VoteSuccess';
import MerchSuccess from './pages/MerchSuccess';
import UpgradeSuccess from './pages/UpgradeSuccess';
import UpgradeTicket from './pages/UpgradeTicket';
import BlogIndex from './pages/blog/BlogIndex';
import BlogPost from './pages/blog/BlogPost';

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

  useEffect(() => {
    const title = 'Connexa Lagos 2026 | Networking Event in Nigeria | Get Tickets';
    const description = 'Join Connexa Lagos 2026 — a powerful networking and opportunity event. Meet the right people, grow your network, and secure your ticket now.';
    const ticketUrl = `${window.location.origin}/#tickets`;

    document.title = title;

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', description);

    const schemaId = 'connexa-event-schema';
    const previousSchema = document.getElementById(schemaId);
    if (previousSchema) {
      previousSchema.remove();
    }

    const schemaScript = document.createElement('script');
    schemaScript.id = schemaId;
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Connexa',
      startDate: '2026-11-28T08:00:00+01:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description,
      location: {
        '@type': 'Place',
        name: 'University of Lagos',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lagos',
          addressCountry: 'NG'
        }
      },
      offers: {
        '@type': 'Offer',
        url: ticketUrl,
        availability: 'https://schema.org/LimitedAvailability',
        priceCurrency: 'NGN'
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      const existingSchema = document.getElementById(schemaId);
      if (existingSchema) {
        existingSchema.remove();
      }
    };
  }, []);

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
  <BlogPreview />
        <Merch />
        <PartnerForm />
        <AffiliateSignup />
      </main>

      <a href="#tickets" className="mobile-sticky-ticket-cta" aria-label="Get tickets">
        Secure Your Ticket Now →
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
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
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
