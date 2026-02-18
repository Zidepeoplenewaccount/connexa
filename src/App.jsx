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

function HomePage() {
  useScrollReveal();
  
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Speakers />
        <Tickets />
        <Awards />
        <Voting />
        <Merch />
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
      </Routes>
    </BrowserRouter>
  );
}