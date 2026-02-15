import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useScrollReveal } from './hooks/ScrollReveal';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Hero from './components/Hero';
import About from './components/About';
import Tickets from './components/Tickets';
import Awards from './components/Awards';
import Voting from './components/Voting';
import Merch from './components/merch';
import Footer from './components/Footer';


function App() {
  useScrollReveal();

  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Tickets />
        <Awards />
        <Voting />
        <Merch />
      </main>
      <Footer />
    </>
  )
}

export default App
