import React from 'react';
import Banner from '../../../Components/Banner/Banner';
import HeroSection from '../../../Components/Hero/HeroSection';
import HowItWorks from '../../../Components/HowItWorks/HowItWorks';
import Features from '../../../Components/Features/Features';
import Testimonials from '../../../Components/Testimonials/Testimonials';

const Home = () => {
    return (
      <div>
        <HeroSection />
        <Banner />
        <HowItWorks />
        <Features />
        <Testimonials />
      </div>
    );
};

export default Home;