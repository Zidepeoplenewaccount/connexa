import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import AffiliateSignup from '../components/AffiliateSignup';
import PoweredBy from '../components/PoweredBy';
import Footer from '../components/Footer';
import FloatingControls from '../components/FloatingControls';

export default function AffiliateProgramPage() {
  useEffect(() => {
    document.title = 'Become a Connexa Affiliate | Connexa 2026';
  }, []);

  return (
    <>
      <Navbar />
      <main className="conversion-site affiliate-standalone-page">
        <AffiliateSignup />
      </main>
      <PoweredBy />
      <Footer />
      <FloatingControls />
    </>
  );
}
