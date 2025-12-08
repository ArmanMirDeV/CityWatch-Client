import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router";

import bannerImg1 from "../../assets/banner/banner1.jpg";
import bannerImg2 from "../../assets/banner/banner2.jpg";
import bannerImg3 from "../../assets/banner/banner3.jpg";
import bannerImg4 from "../../assets/banner/banner4.jpg";
import bannerImg5 from "../../assets/banner/banner5.jpg";
import bannerImg6 from "../../assets/banner/banner6.jpg";
import bannerImg7 from "../../assets/banner/banner7.jpg";
import bannerImg8 from "../../assets/banner/banner8.jpg";
import bannerImg9 from "../../assets/banner/banner9.jpg";
import bannerImg10 from "../../assets/banner/banner10.jpg";

const Banner = () => {
  const slides = [
    { img: bannerImg1, description: "Track broken streetlights" },
    { img: bannerImg2, description: "Report potholes quickly" },
    { img: bannerImg3, description: "Submit water leakage issues" },
    { img: bannerImg4, description: "CityWatch ensures clean streets" },
    { img: bannerImg5, description: "Monitor damaged footpaths" },
    { img: bannerImg6, description: "Boost priority issues easily" },
    { img: bannerImg7, description: "Staff efficiently assigned" },
    { img: bannerImg8, description: "Follow issue timelines" },
    { img: bannerImg9, description: "Receive updates instantly" },
    { img: bannerImg10, description: "Make your city better" },
  ];

  return (
    <div className="relative w-full">
      {/* Carousel */}
      <Carousel
        autoPlay
        interval={2500}
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        swipeable
        emulateTouch
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.img}
              alt={`Banner ${index + 1}`}
              className="w-full h-[500px] object-cover"
            />
            {/* Description Overlay */}
            <div className="absolute  inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
                {slide.description}
              </h2>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Buttons */}
      <div
        className="
          flex items-center gap-4 z-20
          sm:flex-col sm:w-full sm:px-4 sm:mt-4 sm:static
          md:absolute md:left-10 md:bottom-24 md:flex-row
          lg:bottom-32
        "
      >
        <Link to="/dashboard/citizen/report-issue">
          <button
            className="
              flex items-center gap-3 bg-blue-600 text-white font-medium
              px-6 py-3 rounded-full transition-all hover:bg-blue-700 cursor-pointer
              sm:px-4 sm:py-2 sm:text-sm sm:gap-2
            "
          >
            Report Issue
            <span className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center sm:w-6 sm:h-6">
              <FiArrowUpRight className="sm:text-[14px]" />
            </span>
          </button>
        </Link>

        <Link to="/all-issues">
          <button
            className="
              px-6 py-3 rounded-full border border-gray-400 text-primary font-medium
              hover:bg-black transition-all cursor-pointer
              sm:px-4 sm:py-2 sm:text-sm
            "
          >
            View All Issues
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
