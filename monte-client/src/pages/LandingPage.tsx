import React from 'react';
import HeaderLanding from '../components/HeaderLanding';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <HeaderLanding />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
};

export default LandingPage;