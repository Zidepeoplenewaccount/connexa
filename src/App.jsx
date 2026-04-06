import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useScrollReveal } from './hooks/ScrollReveal';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Speakers from './components/speakers';
import Tickets from './components/Tickets';
import Awards from './components/Awards';
import Voting from './components/Voting';
import Merch from './components/merch';
import Footer from './components/Footer';
import PaymentSuccess from './components/paymentSuccess';
import VoteSuccess from './pages/VoteSuccess';
import MerchSuccess from './pages/MerchSuccess';




import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTickets from './pages/admin/AdminTickets';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminVotes from './pages/admin/AdminVotes';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAffiliates from './pages/admin/AdminAffiliates';
import AdminDiscountCodes from './pages/admin/AdminDiscountCodes';
import AdminSpeakers from './pages/admin/AdminSpeakers';

import SpeakerLogin from './pages/speakers/SpeakerLogin';
import SpeakerDashboard from './pages/speakers/SpeakerDashboard';
import SpeakerResetPassword from './pages/speakers/SpeakerResetPassword';

import ProtectedRoute from './components/admin/protectedRoute';
import PartnerForm from './components/PartnerForm';
import Gallery from './components/Gallery';
import AffiliateSignup from './components/AffiliateSignup';
import UpgradeSuccess from './pages/UpgradeSuccess';
import AdminQuestions from './pages/admin/AdminQuestions';
import UpgradeTicket from './pages/UpgradeTicket';
import AdminScanner from './pages/adminScanner/adminScanner';
import ScannerProtectedRoute from './pages/adminScanner/scannerProtectedRoute';




function HomePage() {
  useScrollReveal();
  
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        {/*<Speakers />*/}
        <Gallery />
        <Tickets />
        {/*<Awards />*/}
        {/*<Voting />*/}
        <Merch />
        <PartnerForm />
        <AffiliateSignup />
      </main>
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

        {/* Admin Routes */}
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
          path="/upgrade-success" 
          element={<UpgradeSuccess />} 
        />
        <Route 
          path="/admin/questions" 
          element={<ProtectedRoute><AdminQuestions /></ProtectedRoute>} 
        />

        <Route 
          path="/admin/discount-codes" 
          element={<AdminDiscountCodes />} 
        />

        {/* Connexer Portal */}
        <Route path="/connexers/login" element={<SpeakerLogin />} />
        <Route path="/connexers/reset-password" element={<SpeakerResetPassword />} />
        <Route path="/connexers/dashboard" element={<SpeakerDashboard />} />

        {/* Admin Connexers */}
        <Route
          path="/admin/connexers"
          element={
            <ProtectedRoute>
              <AdminSpeakers />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/scanner" 
          element={
          <ScannerProtectedRoute>
            <AdminScanner />
          </ScannerProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
