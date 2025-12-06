import React from 'react';
import Banner from '../../../Components/Banner/Banner';
import HeroSection from '../../../Components/Hero/HeroSection';
import HowItWorks from '../../../Components/HowItWorks/HowItWorks';

const Home = () => {
    return (
      <div>
        <HeroSection />
        <Banner />
        <HowItWorks />
      </div>
    );
};

export default Home;